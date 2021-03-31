/* eslint-disable @typescript-eslint/no-explicit-any */
import { Glue42Core } from "@glue42/core";
import { Glue42Web } from "@glue42/web";
import { Glue42WebPlatform } from "../../../../platform";
import { objEqual } from "../../../shared/utils";
import { AppDirSetup, AppDirProcessingConfig, BaseApplicationData } from "../types";
import logger from "../../../shared/logger";
import { SessionStorageController } from "../../../controllers/session";
import { RemoteWatcher } from "./remoteWatcher";

export class AppDirectory {
    private onAdded!: (data: BaseApplicationData) => void;
    private onChanged!: (data: BaseApplicationData) => void;
    private onRemoved!: (data: BaseApplicationData) => void;

    constructor(
        private readonly sessionStorage: SessionStorageController,
        private readonly remoteWatcher: RemoteWatcher
    ) { }

    public async start(setup: AppDirSetup): Promise<void> {
        this.logger?.trace("Starting the application directory");
        this.onAdded = setup.onAdded;
        this.onChanged = setup.onChanged;
        this.onRemoved = setup.onRemoved;

        if (setup.config.local && setup.config.local.length) {
            this.logger?.trace("Detected local applications, parsing...");
            const parsedDefinitions: BaseApplicationData[] = setup.config.local.map((def) => this.parseDefinition(def));

            const currentApps: BaseApplicationData[] = this.sessionStorage.getAllApps("inmemory");

            const merged = this.merge(currentApps, parsedDefinitions);

            this.sessionStorage.overwriteApps(merged, "inmemory");
        }

        if (setup.config.remote) {
            this.logger?.trace("Detected remote app store configuration, starting the watcher...");
            this.remoteWatcher.start(setup.config.remote, (apps) => this.processAppDefinitions(apps, {type: "remote", mode: "replace"}));
        }
    }

    public processAppDefinitions(definitions: Array<Glue42Web.AppManager.Definition | Glue42WebPlatform.Applications.FDC3Definition>, config: AppDirProcessingConfig): void {

        const parsedDefinitions: BaseApplicationData[] = definitions.map((def) => this.parseDefinition(def));

        const currentApps: BaseApplicationData[] = this.sessionStorage.getAllApps(config.type);

        const updatedApps = this[config.mode](currentApps, parsedDefinitions);

        this.sessionStorage.overwriteApps(updatedApps, config.type);
    }

    public getAll(): BaseApplicationData[] {
        const inMemory = this.sessionStorage.getAllApps("inmemory");
        const remote = this.sessionStorage.getAllApps("remote");

        return inMemory.concat(remote);
    }

    public exportInMemory(): Glue42Web.AppManager.Definition[] {
        const allBaseApps = this.sessionStorage.getAllApps("inmemory");

        return allBaseApps.map(this.reverseParseDefinition);
    }

    public removeInMemory(name: string): BaseApplicationData | undefined {
        return this.sessionStorage.removeApp(name, "inmemory");
    }

    private merge(currentApps: BaseApplicationData[], parsedDefinitions: BaseApplicationData[]): BaseApplicationData[] {
        for (const definition of parsedDefinitions) {
            const defCurrentIdx = currentApps.findIndex((app) => app.name === definition.name);

            if (defCurrentIdx > -1 && !objEqual(definition, currentApps[defCurrentIdx])) {
                this.logger?.trace(`change detected at definition ${definition.name}`);
                this.onChanged(definition);

                currentApps[defCurrentIdx] = definition;

                continue;
            }

            if (defCurrentIdx < 0) {
                this.logger?.trace(`new definition: ${definition.name} detected, adding and announcing`);
                this.onAdded(definition);
                currentApps.push(definition);
            }
        }

        return currentApps;
    }

    private replace(currentApps: BaseApplicationData[], parsedDefinitions: BaseApplicationData[]): BaseApplicationData[] {
        for (const definition of parsedDefinitions) {
            const defCurrentIdx = currentApps.findIndex((app) => app.name === definition.name);

            if (defCurrentIdx < 0) {
                this.logger?.trace(`new definition: ${definition.name} detected, adding and announcing`);
                this.onAdded(definition);
                continue;
            }

            if (!objEqual(definition, currentApps[defCurrentIdx])) {
                this.logger?.trace(`change detected at definition ${definition.name}`);
                this.onChanged(definition);
            }

            currentApps.splice(defCurrentIdx, 1);
        }

        // everything that is left in the old snap here, means it is removed in the latest one
        currentApps.forEach((app) => {
            this.logger?.trace(`definition ${app.name} missing, removing and announcing`);
            this.onRemoved(app);
        });

        return parsedDefinitions;
    }

    private reverseParseDefinition(definition: BaseApplicationData): Glue42Web.AppManager.Definition {

        const definitionDetails = definition.userProperties.details;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { details, ...removedDetails } = definition.userProperties;

        return {
            name: definition.name,
            type: (definition as any).type || "window",
            title: definition.title,
            version: definition.version,
            icon: (definition as any).icon,
            caption: (definition as any).caption,
            details: definitionDetails,
            customProperties: removedDetails
        };
    }

    private parseDefinition(definition: Glue42Web.AppManager.Definition | Glue42WebPlatform.Applications.FDC3Definition): BaseApplicationData {

        const glue42CoreAppProps = ["name", "title", "version", "customProperties", "icon", "caption", "type"];

        const userProperties = Object.fromEntries(Object.entries(definition).filter(([key]) => !glue42CoreAppProps.includes(key)));

        let createOptions: Glue42Web.AppManager.DefinitionDetails = { url: "" };

        if ((definition as any).manifest) {
            // this is fdc3
            const parsedManifest = JSON.parse((definition as Glue42WebPlatform.Applications.FDC3Definition).manifest);

            const url = parsedManifest.details?.url || parsedManifest.url;

            if (!url || typeof url !== "string") {
                throw new Error(`The FDC3 definition: ${definition.name} is not valid, because there is not url defined in the manifest`);
            }

            createOptions.url = url;
        } else {
            // this is GD
            createOptions = (definition as Glue42Web.AppManager.Definition).details;
        }

        const baseDefinition = {
            createOptions,
            type: (definition as any).type || "window",
            name: definition.name,
            title: definition.title,
            version: definition.version,
            icon: (definition as any).icon,
            caption: (definition as any).caption,
            userProperties: {
                ...userProperties,
                ...(definition as any).customProperties
            }
        };

        if (!baseDefinition.userProperties.details) {
            baseDefinition.userProperties.details = createOptions;
        }

        return baseDefinition;
    }

    private get logger(): Glue42Core.Logger.API | undefined {
        return logger.get("applications.remote.directory");
    }
}