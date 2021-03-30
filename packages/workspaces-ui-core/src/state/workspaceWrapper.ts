import GoldenLayout from "@glue42/golden-layout";
import store from "./store";
import { LayoutStateResolver } from "./resolver";
import { idAsString } from "../utils";
import { Workspace, WorkspaceOptionsWithLayoutName, WorkspaceSummary } from "../types/internal";
import { EmptyVisibleWindowName } from "../utils/constants";
import { WorkspaceWindowWrapper } from "./windowWrapper";
import { WorkspaceContainerWrapper } from "./containerWrapper";

export class WorkspaceWrapper {
    constructor(
        private readonly stateResolver: LayoutStateResolver,
        private readonly workspace: Workspace,
        private readonly workspaceContentItem: GoldenLayout.Component,
        private readonly frameId: string) {
    }

    public get id() {
        return this.workspace.id;
    }

    public get title() {
        const component = this.workspaceContentItem;
        return component.config.title || component.config.componentName;
    }

    public get lastFocusedWindowId() {
        if (!this.workspace?.layout) {
            return;
        }

        const focusedWindowId = (this.workspace.layout.config?.workspacesOptions as any)?.focusedWindowId;

        if (!focusedWindowId) {
            const focusedGroupId = (this.workspace.layout.config?.workspacesOptions as any)?.focusedGroupId;
            const groupContentItem = this.workspace.layout.root.getItemsById(focusedGroupId)[0];

            if (groupContentItem && groupContentItem.type !== "component" && groupContentItem.contentItems.length) {
                const focusedItemInGroup = groupContentItem.contentItems[groupContentItem.contentItems.length - 1].config.id;
                return focusedItemInGroup;
            }

        } else {
            return focusedWindowId;
        }

        return this.workspace.windows.filter((w) => this.stateResolver.isWindowSelected(idAsString(w.id)))[0]?.id;
    }

    public get isSelected() {
        const workspaceLayoutStack = store.workspaceLayout.root.getItemsById(this.workspace.id)[0].parent;
        const activeContentItem = workspaceLayoutStack.getActiveContentItem();

        return idAsString(activeContentItem.config.id) === this.workspace.id;
    }

    public get isHibernated() {
        return typeof this.workspace.hibernateConfig !== "undefined" && typeof this.workspace.hibernateConfig !== null;
    }

    public get tabIndex() {
        const workspaceLayoutStack = store.workspaceLayout.root.getItemsById(this.workspace.id)[0].parent;
        const workspaceIndex = ((workspaceLayoutStack as any).header as GoldenLayout.Header)
            .tabs
            .findIndex((t: GoldenLayout.Tab) => idAsString(t.contentItem.config.id) === this.workspace.id);

        return workspaceIndex;
    }

    public get config(): any {
        const workspace = this.workspace;

        if (this.isHibernated) {
            return workspace.hibernateConfig;
        }

        const glConfig = workspace.layout ? workspace.layout.toConfig() : { workspacesOptions: {}, content: [], id: workspace.id };
        glConfig.workspacesOptions.frameId = this.frameId;
        glConfig.workspacesOptions.positionIndex = this.tabIndex;
        glConfig.workspacesOptions.isHibernated = this.isHibernated;
        glConfig.workspacesOptions.isSelected = this.isSelected;
        glConfig.workspacesOptions.allowDrop = this.allowDrop;
        glConfig.workspacesOptions.allowExtract = this.allowExtract;
        glConfig.workspacesOptions.showWindowAddButtons = this.showAddWindowButtons;
        glConfig.workspacesOptions.showCloseButton = this.showCloseButton;
        glConfig.workspacesOptions.showSaveButton = this.showSaveButton;
        glConfig.workspacesOptions.lockSplitters = this.lockSplitters;
        glConfig.workspacesOptions.lastActive = workspace.lastActive;

        if (!glConfig.workspacesOptions.title) {
            glConfig.workspacesOptions.title = store.getWorkspaceTitle(workspace.id);
        }

        glConfig.workspacesOptions.name = glConfig.workspacesOptions.name || glConfig.workspacesOptions.title;

        this.transformComponentsToWindowSummary(glConfig);
        this.transformParentsToContainerSummary(glConfig);
        return glConfig;
    }

    public get summary(): WorkspaceSummary {
        const config = this.config;
        const workspaceIndex = this.tabIndex;

        const summaryConfig = {
            frameId: this.frameId,
            positionIndex: workspaceIndex,
            title: config.workspacesOptions.title || config.title,
            name: config.workspacesOptions.name || store.getWorkspaceTitle(this.workspace.id),
            layoutName: config.workspacesOptions.layoutName,
            isHibernated: this.isHibernated,
            isSelected: this.isSelected,
            lastActive: this.workspace.lastActive,
            allowDrop: this.allowDrop,
            allowExtract: this.allowExtract,
            lockSplitters: this.lockSplitters,
            showCloseButton: this.showCloseButton,
            showSaveButton: this.showSaveButton,
            showWindowAddButtons: this.showAddWindowButtons
        };

        if ((config.workspacesOptions as WorkspaceOptionsWithLayoutName).layoutName) {
            summaryConfig.layoutName = (config.workspacesOptions as WorkspaceOptionsWithLayoutName).layoutName
        }

        return {
            config: summaryConfig,
            id: this.workspace.id
        };
    }

    public get allowDrop(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).allowDrop;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).allowDrop;
        }

        return result ?? true;
    }

    public set allowDrop(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).allowDrop = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).allowDrop = value;

        this.populateChildrenAllowDrop(value);
    }

    public get allowDropLeft(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).allowDropLeft;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).allowDropLeft;
        }

        return result ?? true;
    }

    public set allowDropLeft(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).allowDropLeft = value;
        }

        (this.workspaceContentItem.config.workspacesConfig as any).allowDropLeft = value;
    }

    public get allowDropTop(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).allowDropTop;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).allowDropTop;
        }

        return result ?? true;
    }

    public set allowDropTop(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).allowDropTop = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).allowDropTop = value;
    }

    public get allowDropRight(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).allowDropRight;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).allowDropRight;
        }

        return result ?? true;
    }

    public set allowDropRight(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).allowDropRight = value;
        }

        (this.workspaceContentItem.config.workspacesConfig as any).allowDropRight = value;
    }

    public get allowDropBottom(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).allowDropBottom;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).allowDropBottom;
        }

        return result ?? true;
    }

    public set allowDropBottom(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).allowDropBottom = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).allowDropBottom = value;
    }

    public get allowExtract(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).allowExtract;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).allowExtract;
        }

        return result ?? true;
    }

    public set allowExtract(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).allowExtract = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).allowExtract = value;

        this.populateChildrenAllowExtract(value);
    }

    public get lockSplitters(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).lockSplitters;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).lockSplitters;
        }

        return result ?? false;
    }

    public set lockSplitters(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).lockSplitters = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).lockSplitters = value;
    }

    public get showSaveButton(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).showSaveButton;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).showSaveButton;
        }

        return result ?? true;
    }

    public set showSaveButton(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).showSaveButton = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).showSaveButton = value;
    }

    public get showCloseButton(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).showCloseButton;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).showCloseButton;
        }

        return result ?? true;
    }

    public set showCloseButton(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).showCloseButton = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).showCloseButton = value;
    }

    public get showAddWindowButtons(): boolean {
        let result;
        if (this.workspace.layout) {
            result = (this.workspace.layout.config.workspacesOptions as any).showAddWindowButtons;
        } else {
            result = (this.workspaceContentItem.config.workspacesConfig as any).showAddWindowButtons;
        }

        return result ?? true;
    }

    public set showAddWindowButtons(value: boolean) {
        if (this.workspace?.layout) {
            (this.workspace.layout.config.workspacesOptions as any).showAddWindowButtons = value;
        }
        (this.workspaceContentItem.config.workspacesConfig as any).showAddWindowButtons = value;
    }

    private transformComponentsToWindowSummary(glConfig: GoldenLayout.ItemConfig) {
        if (glConfig.type === "component" && glConfig.componentName === EmptyVisibleWindowName) {
            return;
        }
        if (glConfig.type === "component") {
            const summary = this.stateResolver.getWindowSummarySync(glConfig.id);

            glConfig.workspacesConfig = glConfig.workspacesConfig || {};
            glConfig.workspacesConfig = { ...glConfig.workspacesConfig, ...summary.config };
            return;
        }
        glConfig.content?.map((c: any) => this.transformComponentsToWindowSummary(c));
    }

    private transformParentsToContainerSummary(glConfig: any) {
        if (glConfig.type === "component") {
            return;
        }

        if (glConfig.type === "stack" || glConfig.type === "row" || glConfig.type === "column") {
            const summary = this.stateResolver.getContainerSummary(glConfig.id);

            glConfig.workspacesConfig = glConfig.workspacesConfig || {};
            glConfig.workspacesConfig = { ...glConfig.workspacesConfig, ...summary.config };
        }

        glConfig.content?.map((c: any) => this.transformParentsToContainerSummary(c));
    }

    private populateChildrenAllowDrop(value?: boolean) {
        const { layout } = this.workspace;

        if (!layout) {
            return;
        }

        const populateRecursive = (item: GoldenLayout.ContentItem) => {
            if (item.type === "component") {
                return;
            }

            const containerWrapper = new WorkspaceContainerWrapper(item, this.frameId, this.workspace.id);
            containerWrapper.allowDrop = value;

            item.contentItems.forEach((ci) => {
                populateRecursive(ci);
            });
        };

        layout.root.contentItems.forEach((ci) => {
            populateRecursive(ci);
        });
    }

    private populateChildrenAllowExtract(value?: boolean) {
        const { layout } = this.workspace;

        if (!layout) {
            return;
        }

        const populateRecursive = (item: GoldenLayout.ContentItem) => {
            if (item.type === "component") {
                const windowWrapper = new WorkspaceWindowWrapper(item, this.frameId);

                windowWrapper.allowExtract = value;
                return;
            }

            if (item.type === "stack") {
                const containerWrapper = new WorkspaceContainerWrapper(item, this.frameId, this.workspace.id);
                containerWrapper.allowExtract = value;
            }

            item.contentItems.forEach((ci) => {
                populateRecursive(ci);
            });
        };

        layout.root.contentItems.forEach((ci) => {
            populateRecursive(ci);
        });
    }
}
