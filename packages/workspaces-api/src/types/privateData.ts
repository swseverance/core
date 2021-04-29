import { ParentSnapshotConfig, SwimlaneWindowSnapshotConfig, FrameSummaryResult, WorkspaceConfigResult, ChildSnapshotResult, GroupSnapshotConfig, RowSnapshotConfig, ColumnSnapshotConfig } from "./protocol";
import { Frame } from "../models/frame";
import { Workspace } from "../models/workspace";
import { Row } from "../models/row";
import { Column } from "../models/column";
import { Group } from "../models/group";
import { AllParentTypes, Child } from "./builders";
import { Window } from "../models/window";
import { IoC } from "../shared/ioc";
import { Base } from "../models/base/base";
import { WorkspacesController } from "./controller";
import { Glue42Workspaces } from "../../workspaces";

export type ModelTypes = "row" | "column" | "group" | "window" | "workspace" | "frame" | "child";

export interface ModelMaps {
    row: Row;
    column: Column;
    group: Group;
    workspace: Workspace;
    window: Window;
    frame: Frame;
    child: Row | Column | Group | Window;
}

export interface SwimlaneItemConfig {
    id: string;
    controller: WorkspacesController;
    parent: Glue42Workspaces.Workspace | Glue42Workspaces.Row | Glue42Workspaces.Column | Glue42Workspaces.Group;
    frame: Frame;
    workspace: Workspace;
}

export interface GroupPrivateData extends SwimlaneItemConfig {
    config: GroupSnapshotConfig;
    type: "group";
    children: Child[];
}

export interface RowPrivateData extends SwimlaneItemConfig {
    config: RowSnapshotConfig;
    type: "row";
    children: Child[];
}

export interface ColumnPrivateData extends SwimlaneItemConfig {
    config: ColumnSnapshotConfig;
    type: "column";
    children: Child[];
}

export type ParentPrivateData = GroupPrivateData | ColumnPrivateData | RowPrivateData;

export interface WindowPrivateData extends SwimlaneItemConfig {
    config: SwimlaneWindowSnapshotConfig;
    type: "window";
}

export interface WorkspacePrivateData {
    id: string;
    type: "workspace";
    config: WorkspaceConfigResult;
    controller: WorkspacesController;
    children: Child[];
    frame: Frame;
    ioc: IoC;
    base: Base;
}

export interface FramePrivateData {
    summary: FrameSummaryResult;
    controller: WorkspacesController;
}

export interface RemapChildData {
    parent?: AllParentTypes;
    config?: SwimlaneWindowSnapshotConfig | ParentSnapshotConfig;
    children?: Child[];
}

export interface RemapWorkspaceData {
    frame?: Frame;
    config?: WorkspaceConfigResult;
    children?: Child[];
}

export interface RefreshChildrenConfig {
    workspace: Glue42Workspaces.Workspace;
    parent: Child | Glue42Workspaces.Workspace;
    children: ChildSnapshotResult[];
    existingChildren: Child[];
}
