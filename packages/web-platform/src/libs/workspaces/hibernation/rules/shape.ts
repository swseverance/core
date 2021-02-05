import { WorkspaceSnapshotResult } from "../../types";

export interface HibernationRule {
    name: string;
    enabled: boolean;
    shouldHibernate(workspace: WorkspaceSnapshotResult): Promise<boolean>;
}
