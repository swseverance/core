/* eslint-disable @typescript-eslint/no-explicit-any */
import { Glue42Web } from "@glue42/web";
import { ControlMessage, CoreClientData, InternalPlatformConfig, LibController, LibDomains } from "../common/types";
import { libDomainDecoder } from "../shared/decoders";
import { GlueController } from "./glue";
import { WindowsController } from "../libs/windows/controller";
import { PortsBridge } from "../connection/portsBridge";
import { ApplicationsController } from "../libs/applications/controller";
import { StateController } from "./state";
import logger from "../shared/logger";
import { generate } from "shortid";
import { LayoutsController } from "../libs/layouts/controller";
import { WorkspacesController } from "../libs/workspaces/controller";
import { IntentsController } from "../libs/intents/controller";
import { ChannelsController } from "../libs/channels/controller";
import { Glue42WebPlatform } from "../../platform";
import { SystemController } from "./system";

export class PlatformController {

    private readonly controllers: { [key in LibDomains]: LibController } = {
        system: this.systemController,
        windows: this.windowsController,
        appManager: this.applicationsController,
        layouts: this.layoutsController,
        workspaces: this.workspacesController,
        intents: this.intentsController,
        channels: this.channelsController
    }

    constructor(
        private readonly systemController: SystemController,
        private readonly glueController: GlueController,
        private readonly windowsController: WindowsController,
        private readonly applicationsController: ApplicationsController,
        private readonly layoutsController: LayoutsController,
        private readonly workspacesController: WorkspacesController,
        private readonly intentsController: IntentsController,
        private readonly channelsController: ChannelsController,
        private readonly portsBridge: PortsBridge,
        private readonly stateController: StateController
    ) { }

    private get logger(): Glue42Web.Logger.API | undefined {
        return logger.get("main.web.platform");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async start(config: InternalPlatformConfig): Promise<void> {
        await this.portsBridge.start(config.gateway);

        this.portsBridge.onClientUnloaded(this.handleClientUnloaded.bind(this));

        await this.glueController.start(config);

        await Promise.all([
            this.glueController.createPlatformSystemMethod(this.handleControlMessage.bind(this)),
            this.glueController.createPlatformSystemStream()
        ]);

        this.stateController.start();

        await Promise.all(Object.values(this.controllers).map((controller) => controller.start(config)));

        await this.glueController.initClientGlue(config?.glue, config?.glueFactory, config?.workspaces?.isFrame);

        if (Array.isArray(config.plugins)) {
            await Promise.all(config.plugins.definitions.filter((def) => def.critical).map(this.startPlugin.bind(this)));

            config.plugins.definitions.filter((def) => !def.critical).map(this.startPlugin.bind(this));
        }
    }

    public getClientGlue(): Glue42Web.API {
        return this.glueController.clientGlue;
    }

    private async startPlugin(definition: Glue42WebPlatform.Plugins.PluginDefinition): Promise<void> {
        try {
            const platformControls: Glue42WebPlatform.Plugins.PlatformControls = {
                control: (args: Glue42WebPlatform.Plugins.ControlMessage): Promise<any> => this.handlePluginMessage(args, definition.name),
                logger: logger.get(definition.name)
            };

            await definition.start(this.glueController.clientGlue, definition.config, platformControls);

        } catch (error) {
            const message = `Plugin: ${definition.name} threw while initiating: ${JSON.stringify(error.message)}`;

            if (definition.critical) {
                throw new Error(message);
            } else {
                this.logger?.warn(message);
            }
        }
    }

    private handleControlMessage(args: ControlMessage, caller: Glue42Web.Interop.Instance, success: (args?: ControlMessage) => void, error: (error?: string | object) => void): void {
        const decodeResult = libDomainDecoder.run(args.domain);

        if (!decodeResult.ok) {
            const errString = JSON.stringify(decodeResult.error);

            this.logger?.trace(`rejecting execution of a command, because of a domain validation error: ${errString}`);

            return error(`Cannot execute this platform control, because of domain validation error: ${errString}`);
        }

        const domain = decodeResult.result;

        args.commandId = generate();

        this.logger?.trace(`[${args.commandId}] received a command for a valid domain: ${domain} from window ${caller.windowId} and interop id ${caller.instance}, forwarding to the appropriate controller`);

        this.controllers[domain]
            .handleControl(args)
            .then((result) => {
                success(result);
                this.logger?.trace(`[${args.commandId}] this command was executed successfully, sending the result to the caller.`);
            })
            .catch((err) => {
                const stringError = typeof err === "string" ? err : JSON.stringify(err.message);
                this.logger?.trace(`[${args.commandId}] this command's execution was rejected, reason: ${stringError}`);
                error(`The platform rejected operation ${args.operation} for domain: ${domain} with reason: ${stringError}`);
            });
    }

    private async handlePluginMessage(args: ControlMessage, pluginName: string): Promise<any> {
        const decodeResult = libDomainDecoder.run(args.domain);

        if (!decodeResult.ok) {
            const errString = JSON.stringify(decodeResult.error);

            this.logger?.trace(`rejecting execution of a command issued by plugin: ${pluginName}, because of a domain validation error: ${errString}`);

            throw new Error(`Cannot execute this platform control, because of domain validation error: ${errString}`);
        }

        const domain = decodeResult.result;

        args.commandId = generate();

        this.logger?.trace(`[${args.commandId}] received a command issued by plugin: ${pluginName} for a valid domain: ${domain}, forwarding to the appropriate controller`);

        const result = await this.controllers[domain].handleControl(args);

        this.logger?.trace(`[${args.commandId}] this command was executed successfully, sending the result to the caller.`);

        return result;
    }

    private handleClientUnloaded(client: CoreClientData): void {
        this.logger?.trace(`detected unloading of client: ${client.windowId}, notifying all controllers`);

        Object.values(this.controllers).forEach((controller, idx) => {
            try {
                controller.handleClientUnloaded?.(client.windowId, client.win);
            } catch (error) {
                const controllerName = Object.keys(this.controllers)[idx];
                this.logger?.error(`${controllerName} controller threw when handling unloaded client ${client.windowId} with error message: ${JSON.stringify(error.message)}`);
            }
        });
    }
}
