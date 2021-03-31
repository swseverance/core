import { Glue42Web } from "@glue42/web";
import { Glue42WebPlatform } from "../../../../platform";
import { allApplicationDefinitionsDecoder } from "../../../shared/decoders";
import { fetchTimeout } from "../../../shared/fetchTimeout";
import { defaultRemoteWatcherHeaders, defaultRemoteWatcherRequestTimeoutMS } from "../defaults";
import logger from "../../../shared/logger";
import { Glue42Core } from "@glue42/core";

export class RemoteWatcher {
    private url!: string;
    private request!: Request;
    private handleApps!: (apps: Array<Glue42Web.AppManager.Definition | Glue42WebPlatform.Applications.FDC3Definition>) => void;
    private requestTimeout!: number;
    private pollingInterval: number | undefined;

    public start(config: Glue42WebPlatform.RemoteStore, handleApps: (apps: Array<Glue42Web.AppManager.Definition | Glue42WebPlatform.Applications.FDC3Definition>) => void): void {
        this.url = config.url;
        this.handleApps = handleApps;
        this.requestTimeout = config.requestTimeout || defaultRemoteWatcherRequestTimeoutMS;
        this.pollingInterval = config.pollingInterval;

        this.setRequest(config.customHeaders);
        
        this.logger?.trace(`Remote watcher configured with timeout: ${this.requestTimeout} and interval: ${this.pollingInterval}`);

        this.poll();
    }

    private async poll(): Promise<void> {

        try {
            const response = await fetchTimeout(this.request, this.requestTimeout);

            const responseJson: { applications: Array<Glue42Web.AppManager.Definition | Glue42WebPlatform.Applications.FDC3Definition> } = await response.json();

            if (!responseJson || !Array.isArray(responseJson.applications)) {
                throw new Error("The remote response was either empty or did not contain an applications collection");
            }
            this.logger?.trace("There is a valid response from the app store, processing definitions...");
            const validatedApps = responseJson.applications.reduce<Array<Glue42Web.AppManager.Definition | Glue42WebPlatform.Applications.FDC3Definition>>((soFar, app) => {

                const result = allApplicationDefinitionsDecoder.run(app);

                if (result.ok) {
                    soFar.push(app);
                } else {
                    this.logger?.warn(`Removing applications definition with name: ${app.name} from the remote response, because of validation error: ${JSON.stringify(result.error)}`);
                }

                return soFar;
            }, []);

            this.handleApps(validatedApps);

        } catch (error) {

            const stringError = typeof error === "string" ? error : JSON.stringify(error.message);
            this.logger?.warn(stringError);

        } finally {
            if (this.pollingInterval) {

                await this.waitInterval();
                this.poll();

            }
        }
    }

    private setRequest(customHeaders: { [key: string]: string } = {}): void {
        const requestHeaders = new Headers();

        for (const key in defaultRemoteWatcherHeaders) {
            requestHeaders.append(key, defaultRemoteWatcherHeaders[key]);
        }

        for (const key in customHeaders) {
            this.logger?.trace("Custom headers detected and set");
            requestHeaders.append(key, customHeaders[key]);
        }

        this.request = new Request(this.url, {
            method: "GET",
            headers: requestHeaders,
            mode: "cors",
            cache: "default"
        });
    }

    private waitInterval(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, this.pollingInterval));
    }

    private get logger(): Glue42Core.Logger.API | undefined {
        return logger.get("applications.remote.directory");
    }
}