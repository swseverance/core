import { Window } from "../models/window";
import { Row } from "../models/row";
import { Column } from "../models/column";
import { Group } from "../models/group";
import { Workspace } from "../models/workspace";
import { Glue42Workspaces } from "../../workspaces";

export type ChildDefinition = Glue42Workspaces.BoxDefinition | Glue42Workspaces.WorkspaceWindowDefinition;
export type ChildBuilder = Glue42Workspaces.BoxBuilder | Glue42Workspaces.WorkspaceWindowDefinition;
export type SubParent = "row" | "column" | "group";
export type AllParent = "row" | "column" | "group" | "workspace";
export type Child = Window | Row | Column | Group;
export type AllParentTypes = Row | Column | Group | Workspace;
export type SubParentTypes = Row | Column | Group;
export type ContainerLockConfig = Glue42Workspaces.ColumnLockConfig | Glue42Workspaces.RowLockConfig | Glue42Workspaces.GroupLockConfig;
