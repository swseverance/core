import { HibernationRule } from "./rules/shape";
import { WorkspaceIdleTimeRule } from "./rules/time";
import { MaximumActiveWorkspacesRule } from "./rules/workspaces";
import { WorkspaceSnapshotResult } from "../types";
import { WorkspacesController } from "../controller";
import { generate } from "shortid";
import { Glue42WebPlatform } from "../../../../platform";
import { IoC } from "../../../shared/ioc";
import logger from "../../../shared/logger";
import { Glue42Web } from "@glue42/web";

export class WorkspaceHibernationWatcher {
    private timer: NodeJS.Timer | undefined;
    private isStarted = false;
    private rules!: HibernationRule[];
    private workspacesController!: WorkspacesController;
    private settings: Glue42WebPlatform.Workspaces.HibernationConfig | undefined;
    private get logger(): Glue42Web.Logger.API | undefined {
        return logger.get("workspaces.controller");
    }

    public start(
        settings: Glue42WebPlatform.Workspaces.HibernationConfig | undefined,
        workspacesController: WorkspacesController): void {
        this.workspacesController = workspacesController;
        this.settings = settings;
        this.rules = this.getRules(settings?.rules);

        try {
            this.logger?.trace(`starting the hibernation watcher with following settings: ${JSON.stringify(this.settings)}`);
            if (this.settings?.enabled && !this.isStarted) {
                this.startCore();
                this.logger?.trace(`The hibernation watcher has started successfully`);
            }
        } catch (error) {
            this.logger?.error(error);
        } finally {
            this.isStarted = true;
        }
    }

    public stop(): void {
        try {
            this.logger?.trace(`trying to stop the hibernation watcher`);
            if (this.settings?.enabled && this.isStarted) {
                this.stopCore();
                this.logger?.trace(`The hibernation watcher was stopped successfully`);
            }
        } catch (error) {
            this.logger?.error(error);
        } finally {
            this.isStarted = false;
        }
    }

    private startCore(): void {
        let interval = this.settings?.interval || 10;
        if (interval && interval > -1) {
            interval = interval * 60_000;
            this.timer = setInterval(this.tryHibernate, interval);
        }
    }

    private stopCore(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    private tryHibernate = async () => {
        const workspaceSummaries = await this.workspacesController.getAllWorkspacesSummaries({}, generate());
        const workspaces = await Promise.all(workspaceSummaries.summaries.map(ws => this.workspacesController.getWorkspaceSnapshot({ itemId: ws.id }, generate())));
        const candidatePromises = await workspaces.reduce<Promise<[WorkspaceSnapshotResult, HibernationRule][]>>(async (acc, workspace) => {
            const result = await acc;
            const rule = await this.shouldHibernate(workspace);
            if (rule) {
                result.push([workspace, rule]);
            }
            return result;
        }, Promise.resolve([]));

        const hibernationCandidates = (await Promise.all(candidatePromises));

        await Promise.all(this.tryHibernateWorkspaces(hibernationCandidates));
    }

    private tryHibernateWorkspaces(workspaces: Array<[WorkspaceSnapshotResult, HibernationRule]>) {
        const workspacesToClose = this.settings?.workspacesToClose || 1;
        return workspaces
            .sort((ws1, ws2) => this.compare(ws1[0], ws2[0]))
            .slice(0, workspacesToClose)
            .map((workspaceToClose) => this.tryHibernateWorkspace(workspaceToClose));
    }

    private compare(ws1: WorkspaceSnapshotResult, ws2: WorkspaceSnapshotResult): number {
        if (ws1.config.lastActive > ws2.config.lastActive) {
            return 1;
        }
        if (ws1.config.lastActive < ws2.config.lastActive) {
            return -1;
        }
        return 0;
    }

    private async tryHibernateWorkspace(tuple: [WorkspaceSnapshotResult, HibernationRule]): Promise<void> {
        try {
            const workspace = tuple[0];
            const rule = tuple[1];
            const workspaceId = workspace.id;
            this.logger?.trace(`trying to hibernate workspace ${workspaceId}, rule ${rule.name}`);
            await this.workspacesController.hibernateWorkspace({ workspaceId }, generate());
            this.logger?.trace(`workspace ${workspaceId} was hibernated successfully`);
        } catch (error) {
            this.logger?.error(error);
        }
    }

    private async shouldHibernate(workspace: WorkspaceSnapshotResult): Promise<HibernationRule | undefined> {
        const snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspace.id }, generate());

        const isWorkspaceHibernated = await this.isWorkspaceHibernated(snapshot);
        const isWorkspaceSelected = await this.isWorkspaceSelected(snapshot);
        const isWorkspaceEmpty = await this.isWorkspaceEmpty(snapshot);

        if (!workspace ||
            isWorkspaceHibernated ||
            isWorkspaceSelected ||
            isWorkspaceEmpty) {
            return;
        }
        return await this.rules.reduce(async (acc, r) => {
            const result = await acc;
            if (result) {
                return result;
            } else if (r.enabled && await r.shouldHibernate(workspace)) {
                return r;
            }
        }, Promise.resolve(undefined as HibernationRule | undefined));
    }

    private async isWorkspaceHibernated(workspaceId: string | WorkspaceSnapshotResult) {
        let snapshot: WorkspaceSnapshotResult;

        if (typeof workspaceId === "string") {
            snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspaceId }, generate());
        } else {
            snapshot = workspaceId;
        }

        return snapshot.config.isHibernated;
    }

    private async isWorkspaceSelected(workspaceId: string | WorkspaceSnapshotResult) {
        let snapshot: WorkspaceSnapshotResult;

        if (typeof workspaceId === "string") {
            snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspaceId }, generate());
        } else {
            snapshot = workspaceId;
        }
        return snapshot.config.isSelected;
    }

    private async isWorkspaceEmpty(workspaceId: string | WorkspaceSnapshotResult) {
        let snapshot: WorkspaceSnapshotResult;

        if (typeof workspaceId === "string") {
            snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspaceId }, generate());
        } else {
            snapshot = workspaceId;
        }

        return !snapshot.children.length;
    }

    private getHibernationRule(ruleConfig: Glue42WebPlatform.Workspaces.HibernationRule): HibernationRule {
        switch (ruleConfig.type) {
            case "MaximumActiveWorkspaces": {
                return new MaximumActiveWorkspacesRule(this.workspacesController, ruleConfig.enabled, ruleConfig.threshold);
            }
            case "WorkspaceIdleTime": {
                return new WorkspaceIdleTimeRule(ruleConfig.enabled, ruleConfig.threshold);
            }
            default: {
                throw new Error(`Unsupported hibernation rule type ${ruleConfig.type}`);
            }
        }
    }

    private getRules(rulesConfig: Glue42WebPlatform.Workspaces.HibernationRule[] | undefined) {
        if (!rulesConfig) {
            return [];
        }

        const uniqueRules = rulesConfig.filter((r, i, s) => {
            return s.indexOf(r) === i;
        });


        return uniqueRules.map((r) => this.getHibernationRule(r));
    }
}
