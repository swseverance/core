import { FrameSummaryResult, SwimlaneWindowSnapshotConfig, WorkspaceSnapshotResult, ParentSnapshotConfig, ChildSnapshotResult, GroupSnapshotConfig, ColumnSnapshotConfig, RowSnapshotConfig } from "./protocol";
import { Workspace } from "../models/workspace";
import { Row } from "../models/row";
import { Column } from "../models/column";
import { Group } from "../models/group";
import { Frame } from "../models/frame";

export interface FrameCreateConfig {
    summary: FrameSummaryResult;
}

export interface WindowCreateConfig {
    id: string;
    parent: Workspace | Row | Column | Group;
    frame: Frame;
    workspace: Workspace;
    config: SwimlaneWindowSnapshotConfig;
}

export interface ParentCreateConfig {
    id: string;
    children: ChildSnapshotResult[];
    parent: Workspace | Row | Column | Group;
    frame: Frame;
    workspace: Workspace;
    config: ParentSnapshotConfig;
}

export interface WorkspaceIoCCreateConfig {
    snapshot: WorkspaceSnapshotResult;
    frame: Frame;
}

export type ModelCreateConfig = FrameCreateConfig | WindowCreateConfig | ParentCreateConfig | WorkspaceIoCCreateConfig;
