/* eslint-disable @typescript-eslint/no-explicit-any */
import { Glue42Workspaces } from "../../workspaces";
import { AddItemResult, WorkspaceSnapshotResult, FrameSnapshotResult } from "./protocol";
import { SubscriptionConfig, WorkspaceEventType, WorkspaceEventAction } from "./subscription";
import { RefreshChildrenConfig } from "./privateData";
import { Child, ContainerLockConfig, SubParentTypes } from "./builders";
import { GDWindow } from "./glue";
import { UnsubscribeFunction } from "callback-registry";

export interface WorkspacesController {
    checkIsInSwimlane(windowId: string): Promise<boolean>;
    checkIsWindowLoaded(windowId: string): boolean;
    createWorkspace(definition: Glue42Workspaces.WorkspaceDefinition, saveConfig?: Glue42Workspaces.WorkspaceCreateConfig): Promise<Glue42Workspaces.Workspace>;
    restoreWorkspace(name: string, options?: Glue42Workspaces.RestoreWorkspaceConfig): Promise<Glue42Workspaces.Workspace>;
    add(type: "container" | "window", parentId: string, parentType: "row" | "column" | "group" | "workspace", definition: Glue42Workspaces.WorkspaceWindowDefinition | Glue42Workspaces.BoxDefinition): Promise<AddItemResult>;
    processLocalSubscription(config: SubscriptionConfig, levelId: string): Promise<Glue42Workspaces.Unsubscribe>;
    processGlobalSubscription(callback: (callbackData: unknown) => void, streamType: WorkspaceEventType, action: WorkspaceEventAction): Promise<Glue42Workspaces.Unsubscribe>;
    getFrame(selector: { windowId?: string; predicate?: (frame: Glue42Workspaces.Frame) => boolean }): Promise<Glue42Workspaces.Frame>;
    getFrames(predicate?: (frame: Glue42Workspaces.Frame) => boolean): Promise<Glue42Workspaces.Frame[]>;
    getWorkspace(predicate: (workspace: Glue42Workspaces.Workspace) => boolean): Promise<Glue42Workspaces.Workspace>;
    getWorkspaces(predicate?: (workspace: Glue42Workspaces.Workspace) => boolean): Promise<Glue42Workspaces.Workspace[]>;
    getAllWorkspaceSummaries(): Promise<Glue42Workspaces.WorkspaceSummary[]>;
    getWindow(predicate: (swimlaneWindow: Glue42Workspaces.WorkspaceWindow) => boolean): Promise<Glue42Workspaces.WorkspaceWindow>;
    getParent(predicate: (parent: Glue42Workspaces.WorkspaceBox) => boolean): Promise<Glue42Workspaces.WorkspaceBox>;
    getLayoutSummaries(): Promise<Glue42Workspaces.WorkspaceLayoutSummary[]>;
    deleteLayout(name: string): Promise<void>;
    exportLayout(predicate?: (layout: Glue42Workspaces.WorkspaceLayout) => boolean): Promise<Glue42Workspaces.WorkspaceLayout[]>;
    bundleTo(type: "row" | "column", workspaceId: string): Promise<void>;
    getWorkspaceContext(workspaceId: string): Promise<any>;
    setWorkspaceContext(workspaceId: string, data: any): Promise<void>;
    updateWorkspaceContext(workspaceId: string, data: any): Promise<void>;
    subscribeWorkspaceContextUpdated(workspaceId: string, callback: (data: any) => void): Promise<UnsubscribeFunction>;
    saveLayout(config: Glue42Workspaces.WorkspaceLayoutSaveConfig): Promise<Glue42Workspaces.WorkspaceLayout>;
    importLayout(layouts: Glue42Workspaces.WorkspaceLayout[], mode: "replace" | "merge"): Promise<void>;
    handleOnSaved(callback: (layout: Glue42Workspaces.WorkspaceLayout) => void): UnsubscribeFunction;
    handleOnRemoved(callback: (layout: Glue42Workspaces.WorkspaceLayout) => void): UnsubscribeFunction;
    restoreItem(itemId: string): Promise<void>;
    maximizeItem(itemId: string): Promise<void>;
    changeFrameState(frameId: string, state: Glue42Workspaces.FrameState): Promise<void>;
    getFrameState(frameId: string): Promise<Glue42Workspaces.FrameState>;
    focusItem(itemId: string): Promise<void>;
    closeItem(itemId: string, frame?: Glue42Workspaces.Frame): Promise<void>;
    resizeItem(itemId: string, config: Glue42Workspaces.ResizeConfig): Promise<void>;
    moveFrame(itemId: string, config: Glue42Workspaces.MoveConfig): Promise<void>;
    getGDWindow(itemId: string): GDWindow;
    forceLoadWindow(itemId: string): Promise<string>;
    ejectWindow(itemId: string): Promise<string>;
    moveWindowTo(itemId: string, newParentId: string): Promise<void>;
    getSnapshot(itemId: string, type: "workspace" | "frame"): Promise<WorkspaceSnapshotResult | FrameSnapshotResult>;
    setItemTitle(itemId: string, title: string): Promise<void>;
    flatChildren(children: Child[]): Child[];
    refreshChildren(config: RefreshChildrenConfig): Child[];
    iterateFindChild(children: Child[], predicate: (child: Child) => boolean): Child;
    iterateFilterChildren(children: Child[], predicate: (child: Child) => boolean): Child[];
    hibernateWorkspace(workspaceId: string): Promise<void>;
    resumeWorkspace(workspaceId: string): Promise<void>;
    lockWorkspace(workspaceId: string, config?: Glue42Workspaces.WorkspaceLockConfig): Promise<void>;
    lockWindow(windowPlacementId: string, config?: Glue42Workspaces.WorkspaceWindowLockConfig): Promise<void>;
    lockContainer(itemId: string, type: SubParentTypes["type"], config?: ContainerLockConfig): Promise<void>;
    getFrameConstraints(frameId: string): Promise<Glue42Workspaces.Constraints>;
}
