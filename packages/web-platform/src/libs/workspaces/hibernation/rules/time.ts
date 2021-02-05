import { WorkspaceSnapshotResult } from "../../types";
import { HibernationRule } from "./shape";

export class WorkspaceIdleTimeRule implements HibernationRule {
    private threshold: number;

    constructor(public enabled: boolean, threshold: number) {
        this.threshold = threshold * (60 * 1000);
    }

    public get name(): string {
        return "WorkspaceIdleTimeRule";
    }

    public async shouldHibernate(workspace: WorkspaceSnapshotResult): Promise<boolean> {
        const diff = (new Date()).getTime() - workspace.config.lastActive;
        return diff > this.threshold;
    }
}
