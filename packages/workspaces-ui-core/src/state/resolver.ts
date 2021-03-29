import { WindowSummary, WorkspaceSummary, ContainerSummary, WorkspaceOptionsWithLayoutName, WorkspaceConfig } from "../types/internal";
import store from "./store";
import GoldenLayout, { ItemConfig } from "@glue42/golden-layout";
import { LayoutEventEmitter } from "../layout/eventEmitter";
import { idAsString } from "../utils";
import { EmptyVisibleWindowName } from "../utils/constants";
import { IFrameController } from "../iframeController";
import { WorkspaceWindowWrapper } from "./windowWrapper";
import { WorkspaceWrapper } from "./workspaceWrapper";
import { WorkspaceContainerWrapper } from "./containerWrapper";

export class LayoutStateResolver {
    constructor(private readonly _frameId: string,
        private readonly _layoutEventEmitter: LayoutEventEmitter,
        private readonly frameController: IFrameController) { }

    public async getWindowSummary(windowId: string | string[]): Promise<WindowSummary> {
        windowId = Array.isArray(windowId) ? windowId[0] : windowId;
        let windowContentItem = store.getWindowContentItem(windowId);
        if (!windowContentItem) {
            await this.waitForWindowContentItem(windowId);
            windowContentItem = store.getWindowContentItem(windowId);
        }
        const wrapper = new WorkspaceWindowWrapper(windowContentItem, this._frameId);
        return wrapper.summary;
    }

    public getWindowSummarySync(windowId: string | string[], contentItem?: GoldenLayout.Component): WindowSummary {
        windowId = Array.isArray(windowId) ? windowId[0] : windowId;
        const windowContentItem = contentItem || store.getWindowContentItem(windowId);

        const wrapper = new WorkspaceWindowWrapper(windowContentItem, this._frameId);
        return wrapper.summary;
    }

    public getWorkspaceConfig(workspaceId: string): GoldenLayout.Config {
        const workspace = store.getById(workspaceId);

        if (!workspace) {
            throw new Error(`Could find workspace to remove with id ${workspaceId}`);
        }
     
        const wrapper = new WorkspaceWrapper(this, workspace, store.getWorkspaceContentItem(workspace.id), this._frameId);

        return wrapper.config;
    }

    public getWorkspaceSummary(workspaceId: string): WorkspaceSummary {
        const wrapper = new WorkspaceWrapper(this,
            store.getById(workspaceId),
            store.getWorkspaceContentItem(workspaceId),
            this._frameId);

        return wrapper.summary;
    }

    public isWindowMaximized(id: string | string[]): boolean {
        const placementId = idAsString(id);
        const windowContentItem = store.getWindowContentItem(placementId);
        const wrapper = new WorkspaceWindowWrapper(windowContentItem, this._frameId);

        return wrapper.isMaximized;
    }

    public isWindowSelected(id: string | string[]): boolean {
        const placementId = idAsString(id);
        const windowContentItem = store.getWindowContentItem(placementId);
        const wrapper = new WorkspaceWindowWrapper(windowContentItem, this._frameId);
        return wrapper.isSelected;
    }

    public isWorkspaceSelected(id: string): boolean {
        const workspace = store.getById(id);
        const workspaceContentItem = store.getWorkspaceContentItem(id);
        const wrapper = new WorkspaceWrapper(this, workspace, workspaceContentItem, this._frameId);

        return wrapper.isSelected;
    }

    public isWorkspaceHibernated(id: string): boolean {
        const workspace = store.getById(id);
        if (!workspace) {
            throw new Error(`Could not find workspace ${id} in ${this._frameId} to check if hibernated`);
        }

        const workspaceItem = store.getWorkspaceContentItem(workspace.id);
        const wrapper = new WorkspaceWrapper(this, workspace, workspaceItem, this._frameId);

        return wrapper.isHibernated;
    }

    public getContainerSummary(containerId: string | string[]): ContainerSummary {
        containerId = idAsString(containerId);
        const contentItem = store.getContainer(containerId);
        const wrapper = new WorkspaceContainerWrapper(contentItem, this._frameId);

        return wrapper.summary;
    }

    public getContainerSummaryByReference(item: GoldenLayout.ContentItem, workspaceId: string): ContainerSummary {
        if (item.type === "component") {
            throw new Error(`Tried to get container summary from item ${item.type} ${item.config.id}`);
        }

        const wrapper = new WorkspaceContainerWrapper(item, this._frameId, workspaceId);

        return wrapper.summary;
    }

    public getContainerConfig(containerId: string | string[]): GoldenLayout.ItemConfig {
        const contentItem = store.getContainer(containerId);
        const wrapper = new WorkspaceContainerWrapper(contentItem, this._frameId);

        return wrapper.config;
    }

    public isWindowInWorkspace(windowId: string) {
        return !!store.getWindowContentItem(windowId);
    }

    public getFrameSnapshot() {
        const allWorkspaceSnapshots = store.workspaceIds.map(wid => this.getWorkspaceSummary(wid));
        return {
            id: this._frameId,
            config: {},
            workspaces: allWorkspaceSnapshots
        };
    }

    public getSnapshot(itemId: string) {
        try {
            return this.getWorkspaceConfig(itemId);
        } catch (error) {
            return this.getFrameSnapshot();
        }
    }

    public extractWindowSummariesFromSnapshot(snapshot: GoldenLayout.Config) {
        const result: WindowSummary[] = [];
        const getAllWindows = (item: GoldenLayout.ItemConfig, parentId: string) => {
            if (item.type === "component") {
                result.push({
                    itemId: idAsString(item.id),
                    parentId,
                    config: item.workspacesConfig as any
                });
                return;
            }

            item.content.forEach((c: any) => getAllWindows(c, idAsString(item.id)));
        };

        getAllWindows(snapshot as unknown as GoldenLayout.ItemConfig, undefined);

        return result;
    }

    public isWindowLoaded(id: string | string[]) {
        return this.frameController.hasFrame(idAsString(id));
    }


    private waitForWindowContentItem(windowId: string) {
        return new Promise<void>((res) => {
            const unsub = this._layoutEventEmitter.onContentComponentCreated((component) => {
                if (component.config.id === windowId) {
                    unsub();
                    res();
                }
            });

            const windowContentItem = store.getWindowContentItem(windowId);
            if (windowContentItem) {
                unsub();
                res();
            }
        });
    }
}
