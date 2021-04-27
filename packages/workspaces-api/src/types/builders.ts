import { Glue42Workspaces } from "../../workspaces";

export type ChildDefinition = Glue42Workspaces.BoxDefinition | Glue42Workspaces.WorkspaceWindowDefinition;
export type ChildBuilder = Glue42Workspaces.BoxBuilder | Glue42Workspaces.WorkspaceWindowDefinition;
export type SubParent = "row" | "column" | "group";
export type AllParent = "row" | "column" | "group" | "workspace";
export type Child = Glue42Workspaces.WorkspaceWindow | Glue42Workspaces.Row | Glue42Workspaces.Column | Glue42Workspaces.Group;
export type AllParentTypes = Glue42Workspaces.Row | Glue42Workspaces.Column | Glue42Workspaces.Group | Glue42Workspaces.Workspace;
export type SubParentTypes = Glue42Workspaces.Row | Glue42Workspaces.Column | Glue42Workspaces.Group;
export type ContainerLockConfig = Glue42Workspaces.ColumnLockConfig | Glue42Workspaces.RowLockConfig | Glue42Workspaces.GroupLockConfig;
