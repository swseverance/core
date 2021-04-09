import { Glue42WebPlatform } from "../../../platform";

export const defaultLoadingConfig: Glue42WebPlatform.Workspaces.LoadingConfig = {
    defaultStrategy: "direct",
    delayed: {
        batch: 1,
        initialOffsetInterval: 1000,
        interval: 5000
    },
    showDelayedIndicator: false
};