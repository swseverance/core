import { FrameSummaryResult, SwimlaneWindowSnapshotConfig, WorkspaceSnapshotResult, ParentSnapshotConfig, ChildSnapshotResult } from "./protocol";
import { Workspace } from "../models/workspace";
import { Frame } from "../models/frame";
import { Glue42Workspaces } from "../../workspaces";
import { AllParentTypes } from "./builders";

export interface FrameCreateConfig {
    summary: FrameSummaryResult;
}

export interface WindowCreateConfig {
    id: string;
    parent: AllParentTypes;
    frame: Frame;
    workspace: Workspace;
    config: SwimlaneWindowSnapshotConfig;
}

export interface ParentCreateConfig {
    id: string;
    children: ChildSnapshotResult[];
    parent: AllParentTypes;
    frame: Frame;
    workspace: Glue42Workspaces.Workspace;
    config: ParentSnapshotConfig;
}

export interface WorkspaceIoCCreateConfig {
    snapshot: WorkspaceSnapshotResult;
    frame: Frame;
}

export type ModelCreateConfig = FrameCreateConfig | WindowCreateConfig | ParentCreateConfig | WorkspaceIoCCreateConfig;
