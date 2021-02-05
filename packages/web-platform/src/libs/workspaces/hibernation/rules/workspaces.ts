import { generate } from "shortid";
import { WorkspacesController } from "../../controller";
import { WorkspaceSnapshotResult } from "../../types";
import { HibernationRule } from "./shape";

export class MaximumActiveWorkspacesRule implements HibernationRule {
    private threshold: number;

    constructor(private readonly workspacesController: WorkspacesController, public enabled: boolean, threshold: number) {
        this.threshold = threshold;
    }

    public get name(): string {
        return "MaximumActiveWorkspacesRule";
    }

    public async shouldHibernate(workspace: WorkspaceSnapshotResult): Promise<boolean> {
        const workspacesCount = await this.getActiveWorkspacesCount();
        return workspacesCount > this.threshold;
    }

    private async getActiveWorkspacesCount(): Promise<number> {
        const workspaceSummaries = await this.workspacesController.getAllWorkspacesSummaries({}, generate());
        const workspaces = await Promise.all(workspaceSummaries.summaries.map(ws => this.workspacesController.getWorkspaceSnapshot({ itemId: ws.id }, generate())));

        const activeWorkspaces = await workspaces.reduce<Promise<WorkspaceSnapshotResult[]>>(async (acc, w) => {
            const result = await acc;
            const isWorkspaceHibernated = w.config.isHibernated;
            const isWorkspaceEmpty = !w.children.length;

            if (!isWorkspaceEmpty && !isWorkspaceHibernated) {
                result.push(w);
            }

            return result;
        }, Promise.resolve([]));

        return activeWorkspaces.length;
    }
}
