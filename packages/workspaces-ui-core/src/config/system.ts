import { Glue42Web } from "@glue42/web";
import { WorkspacesSystemConfig } from "../types/internal";
import { PlatformControlMethod } from "../utils/constants";

class WorkspacesSystemSettingsProvider {

    private settings: WorkspacesSystemConfig;

    public async getSettings(glue: Glue42Web.API) {
        if (!this.settings) {
            this.settings = await this.askForSettings(glue);
        }

        return this.settings;
    }

    private async askForSettings(glue: Glue42Web.API) {
        const result = await glue.interop.invoke<WorkspacesSystemConfig>(PlatformControlMethod, {
            domain: "workspaces",
            operation: "getWorkspacesConfig",
            data: {
            }
        });

        return result.returned;
    }

}

export default new WorkspacesSystemSettingsProvider();