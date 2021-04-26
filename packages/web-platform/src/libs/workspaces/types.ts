import { Glue42Workspaces } from "@glue42/workspaces-api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WorkspaceWindowData {
    name: string;
    windowId: string;
    frameId: string;
    appName?: string;
    context?: any;
    title?: string;
}

export type WorkspaceEventType = "frame" | "workspace" | "container" | "window";
export type WorkspaceEventScope = "global" | "frame" | "workspace" | "window";
export type WorkspaceEventAction = "opened" | "closing" | "closed" | "focus" | "added" | "loaded" | "removed" | "childrenUpdate" | "containerChange" | "maximized" | "minimized" | "normal" | "selected";
export interface WorkspaceEventPayload {
    action: WorkspaceEventAction;
    type: WorkspaceEventType;
    payload: FrameStreamData | WorkspaceStreamData | ContainerStreamData | WindowStreamData;
}

export type WorkspacesOperationsTypes = "isWindowInWorkspace" |
    "createWorkspace" |
    "getAllFramesSummaries" |
    "getFrameSummary" |
    "getAllWorkspacesSummaries" |
    "getWorkspaceSnapshot" |
    "getAllLayoutsSummaries" |
    "openWorkspace" |
    "deleteLayout" |
    "saveLayout" |
    "importLayout" |
    "exportAllLayouts" |
    "restoreItem" |
    "maximizeItem" |
    "focusItem" |
    "closeItem" |
    "resizeItem" |
    "moveFrame" |
    "getFrameSnapshot" |
    "forceLoadWindow" |
    "ejectWindow" |
    "setItemTitle" |
    "moveWindowTo" |
    "addWindow" |
    "addContainer" |
    "bundleWorkspace" |
    "changeFrameState" |
    "getFrameState" |
    "frameHello" |
    "hibernateWorkspace" |
    "resumeWorkspace" |
    "getWorkspacesConfig" |
    "lockWorkspace" |
    "lockContainer" |
    "lockWindow";

export interface FrameQueryConfig {
    frameId?: string;
    itemId?: string;
    newFrame?: Glue42Workspaces.NewFrameConfig | boolean;
}

export interface FrameLock {
    lift(value?: void | PromiseLike<void> | undefined): void;
}

export interface FrameHello {
    windowId?: string;
}

export interface FrameInstance {
    windowId: string;
}

export interface FrameSessionData {
    windowId: string;
    active: boolean;
    isPlatform: boolean;
}

// #region incoming
export interface IsWindowInSwimlaneResult {
    inWorkspace: boolean;
}

export interface WorkspacesLayoutImportConfig {
    layout: Glue42Workspaces.WorkspaceLayout;
    mode: "replace" | "merge";
}

export interface WorkspaceConfigResult {
    frameId: string;
    title: string;
    name: string;
    positionIndex: number;
    layoutName: string | undefined;
    isSelected: boolean;
    isHibernated: boolean;
    lastActive: number;
}

export interface BaseChildSnapshotConfig {
    frameId: string;
    workspaceId: string;
    positionIndex: number;
}

export interface ParentSnapshotConfig extends BaseChildSnapshotConfig {
    type?: "window" | "row" | "column" | "group"; // this just a place-holder until there are real parent-specific configs
}

export interface SwimlaneWindowSnapshotConfig extends BaseChildSnapshotConfig {
    windowId?: string;
    isMaximized: boolean;
    isFocused: boolean;
    appName?: string;
    title?: string;
}

export interface ChildSnapshotResult {
    id: string;
    type: "window" | "row" | "column" | "group";
    children?: ChildSnapshotResult[];
    config: ParentSnapshotConfig | SwimlaneWindowSnapshotConfig;
}

export interface FrameSnapshotResult {
    id: string;
    config: any;
    workspaces: WorkspaceSnapshotResult[];
}

export interface FrameSummaryResult {
    id: string;
}

export interface FrameSummariesResult {
    summaries: FrameSummaryResult[];
}

export interface WorkspaceSnapshotResult {
    id: string;
    config: WorkspaceConfigResult;
    children: ChildSnapshotResult[];
    frameSummary: FrameSummaryResult;
}

export interface WorkspaceSummaryResult {
    id: string;
    config: WorkspaceConfigResult;
}

export interface WorkspaceSummariesResult {
    summaries: WorkspaceSummaryResult[];
}

export interface LayoutSummary {
    name: string;
}

export interface LayoutSummariesResult {
    summaries: LayoutSummary[];
}

export interface ContainerSummaryResult {
    itemId: string;
    config: ParentSnapshotConfig;
}

export interface ExportedLayoutsResult {
    layouts: Glue42Workspaces.WorkspaceLayout[];
}

export interface SimpleWindowOperationSuccessResult {
    windowId: string;
}

export interface AddItemResult {
    itemId: string;
    windowId?: string;
}

export interface PingResult {
    live: boolean;
}

export interface FrameStateResult {
    state: Glue42Workspaces.FrameState;
}

// #endregion

// #region outgoing

export interface WorkspaceCreateConfigProtocol extends Glue42Workspaces.WorkspaceDefinition {
    saveConfig?: Glue42Workspaces.WorkspaceCreateConfig;
}

export interface GetFrameSummaryConfig {
    itemId: string;
}

export interface OpenWorkspaceConfig {
    name: string;
    restoreOptions?: Glue42Workspaces.RestoreWorkspaceConfig;
}

export interface DeleteLayoutConfig {
    name: string;
}

export interface SimpleItemConfig {
    itemId: string;
}

export interface FrameStateConfig {
    frameId: string;
    requestedState?: Glue42Workspaces.FrameState;
}

export interface ResizeItemConfig {
    itemId: string;
    width?: number;
    height?: number;
    relative?: boolean;
}

export interface MoveFrameConfig {
    itemId: string;
    top?: number;
    left?: number;
    relative?: boolean;
}

export interface SetItemTitleConfig {
    itemId: string;
    title: string;
}

export interface MoveWindowConfig {
    itemId: string;
    containerId: string;
}

export interface AddWindowConfig {
    definition: Glue42Workspaces.WorkspaceWindowDefinition;
    parentId: string;
    parentType: "row" | "column" | "group" | "workspace";
}

export interface AddContainerConfig {
    definition: Glue42Workspaces.BoxDefinition;
    parentId: string;
    parentType: "row" | "column" | "group" | "workspace";
}

export interface BundleConfig {
    type: "row" | "column";
    workspaceId: string;
}

export interface WorkspaceSelector {
    workspaceId: string;
}

// #endregion

export interface FrameStreamData {
    frameSummary: FrameSummaryResult;
}

export interface WorkspaceStreamData {
    workspaceSummary: WorkspaceSummaryResult;
    frameSummary: FrameSummaryResult;
}

export interface ContainerStreamData {
    containerSummary: ContainerSummaryResult;
}

export interface WindowStreamData {
    windowSummary: {
        itemId: string;
        parentId: string;
        config: SwimlaneWindowSnapshotConfig;
    };
}

export type WorkspaceConfigWithReuseWorkspaceId = Glue42Workspaces.WorkspaceConfig & { reuseWorkspaceId: string };

export interface LockWindowConfig {
    windowPlacementId: string;
    config?: {
        allowExtract?: boolean;
        showCloseButton?: boolean;
    };
}

export interface LockRowConfig {
    itemId: string;
    type: "row";
    config?: {
        allowDrop?: boolean;
    };
}

export interface LockColumnConfig {
    itemId: string;
    type: "column";
    config?: {
        allowDrop?: boolean;
    };
}

export interface LockGroupConfig {
    itemId: string;
    type: "group";
    config?: {
        allowExtract?: boolean;
        allowDrop?: boolean;
        showMaximizeButton?: boolean;
        showEjectButton?: boolean;
        showAddWindowButton?: boolean;
    };
}

export type LockContainerConfig = LockColumnConfig | LockRowConfig | LockGroupConfig;

export interface LockWorkspaceConfig {
    workspaceId: string;
    config?: {
        allowDrop?: boolean;
        allowDropLeft?: boolean;
        allowDropTop?: boolean;
        allowDropRight?: boolean;
        allowDropBottom?: boolean;
        allowExtract?: boolean;
        allowSplitters?: boolean;
        showCloseButton?: boolean;
        showSaveButton?: boolean;
        showAddWindowButtons?: boolean;
        showWindowCloseButtons?: boolean;
        showEjectButtons?: boolean;
    };
}