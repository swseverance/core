import { ParentSnapshotConfig, SwimlaneWindowSnapshotConfig, FrameSummaryResult, WorkspaceConfigResult, ChildSnapshotResult, GroupSnapshotConfig, RowSnapshotConfig, SimpleItemConfig, ColumnSnapshotConfig } from "./protocol";
import { Frame } from "../models/frame";
import { Workspace } from "../models/workspace";
import { Row } from "../models/row";
import { Column } from "../models/column";
import { Group } from "../models/group";
import { Child, SubParent } from "./builders";
import { Window } from "../models/window";
import { IoC } from "../shared/ioc";
import { Base } from "../models/base/base";
import { WorkspacesController } from "./controller";

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
    parent: Workspace | Row | Column | Group;
    frame: Frame;
    workspace: Workspace;
}

// export interface ParentPrivateData extends SwimlaneItemConfig {
//     config: ParentSnapshotConfig;
//     type: SubParent;
//     children: Child[];
// }

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
    parent?: Workspace | Row | Column | Group;
    config?: SwimlaneWindowSnapshotConfig | ParentSnapshotConfig;
    children?: Child[];
}

export interface RemapWorkspaceData {
    frame?: Frame;
    config?: WorkspaceConfigResult;
    children?: Child[];
}

export interface RefreshChildrenConfig {
    workspace: Workspace;
    parent: Child | Workspace;
    children: ChildSnapshotResult[];
    existingChildren: Child[];
}
