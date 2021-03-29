import GoldenLayout from "@glue42/golden-layout";
import { WindowSummary } from "../types/internal";
import { idAsString } from "../utils";
import store from "./store";

export class WorkspaceWindowWrapper {
    constructor(
        private readonly windowContentItem: GoldenLayout.Component,
        private readonly frameId: string) {
    }

    public get allowExtract(): boolean | undefined {
        return (this.windowContentItem.config.workspacesConfig as any).allowExtract ?? true;
    }

    public set allowExtract(value: boolean | undefined) {
        (this.windowContentItem.config.workspacesConfig as any).allowExtract = value;
    }

    public get showCloseButton(): boolean | undefined {
        return (this.windowContentItem.config.workspacesConfig as any).showCloseButton ?? true;
    }

    public set showCloseButton(value: boolean | undefined) {
        (this.windowContentItem.config.workspacesConfig as any).showCloseButton = value;
    }

    public get isMaximized(): boolean {
        return this.windowContentItem?.parent ? this.windowContentItem?.parent?.isMaximized : false;
    }

    public get isSelected(): boolean {
        return idAsString(this.windowContentItem?.parent.getActiveContentItem().config.id) === idAsString(this.windowContentItem.config.id);
    }

    public get index() {
        return this.windowContentItem.parent?.contentItems.indexOf(this.windowContentItem) || 0;
    }

    public get isTabless() {
        const parent = this.windowContentItem?.parent;

        return !!parent?.config?.workspacesConfig?.wrapper;
    }

    public get summary(): WindowSummary {
        return this.getSummaryCore(this.windowContentItem as GoldenLayout.Component,
            idAsString(this.windowContentItem.config.id));
    }

    public get config(): GoldenLayout.ComponentConfig {
        return this.windowContentItem?.config;
    }

    private getSummaryCore(windowContentItem: GoldenLayout.Component, winId: string): WindowSummary {
        const isFocused = windowContentItem.parent.getActiveContentItem().config.id === windowContentItem.config.id;
        const isLoaded = windowContentItem.config.componentState.windowId !== undefined;
        const positionIndex = this.index;
        const workspaceId = store.getByWindowId(winId)?.id;
        const { appName, url, windowId } = windowContentItem.config.componentState;

        const userFriendlyParent = this.getUserFriendlyParent(windowContentItem);

        return {
            itemId: idAsString(windowContentItem.config.id),
            parentId: idAsString(userFriendlyParent.config.id),
            config: {
                frameId: this.frameId,
                isFocused,
                isLoaded,
                positionIndex,
                workspaceId,
                windowId,
                isMaximized: this.isMaximized,
                appName,
                url,
                title: windowContentItem.config.title,
                allowExtract: this.allowExtract,
                showCloseButton: this.showCloseButton
            }
        };
    }

    private getUserFriendlyParent(contentItem: GoldenLayout.ContentItem): GoldenLayout.ContentItem {
        if (!contentItem.parent) {
            return contentItem;
        }

        if (contentItem.parent?.config?.workspacesConfig?.wrapper) {
            return this.getUserFriendlyParent(contentItem.parent as any);
        }

        return contentItem.parent as any;
    }
}
