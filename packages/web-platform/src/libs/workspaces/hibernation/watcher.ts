import { HibernationRule } from "./rules/shape";
import { WorkspaceIdleTimeRule } from "./rules/time";
import { MaximumActiveWorkspacesRule } from "./rules/workspaces";
import { WorkspaceConfigResult, WorkspaceEventPayload, WorkspaceSnapshotResult, WorkspaceStreamData, WorkspaceSummariesResult } from "../types";
import { WorkspacesController } from "../controller";
import { generate } from "shortid";
import { Glue42WebPlatform } from "../../../../platform";
import logger from "../../../shared/logger";
import { Glue42Web } from "@glue42/web";
import { UnsubscribeFunction } from "callback-registry";

export class WorkspaceHibernationWatcher {
    private isStarted = false;
    private workspacesController!: WorkspacesController;
    private settings: Glue42WebPlatform.Workspaces.HibernationConfig | undefined;
    private workspaceEventUnsub: UnsubscribeFunction | undefined;
    private windowEventUnsub: UnsubscribeFunction | undefined;
    private get logger(): Glue42Web.Logger.API | undefined {
        return logger.get("workspaces.controller");
    }
    private readonly workspaceIdToTimer: { [wid: string]: number } = {};

    public start(
        settings: Glue42WebPlatform.Workspaces.HibernationConfig | undefined,
        workspacesController: WorkspacesController): void {
        this.workspacesController = workspacesController;
        this.settings = settings;
        try {
            this.logger?.trace(`starting the hibernation watcher with following settings: ${JSON.stringify(this.settings)}`);
            if (!this.isStarted && this.settings) {
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
            if (this.isStarted) {
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
        this.workspaceEventUnsub = this.workspacesController.subscribeForWorkspaceEvent((e) => {
            const isWorkspaceOpened = e.action === "opened" || e.action === "added";
            const isWorkspaceSelected = e.action === "selected";
            const workspaceData = e.payload as WorkspaceStreamData;

            if (isWorkspaceOpened) {
                this.checkMaximumAmount();
            }

            if (isWorkspaceSelected) {
                const timeout = this.workspaceIdToTimer[workspaceData.workspaceSummary.id];

                if (timeout) {
                    clearTimeout(timeout);
                    delete this.workspaceIdToTimer[workspaceData.workspaceSummary.id];
                }

                this.addTimersForWorkspacesInFrame(e);
                this.checkMaximumAmount();
            }
        });

        this.windowEventUnsub = this.workspacesController.subscribeForWindowEvent((e) => {
            const isWindowOpened = e.action === "opened" || e.action === "added";

            if (isWindowOpened) {
                this.checkMaximumAmount();
            }
        });
    }

    private stopCore(): void {
        if (this.workspaceEventUnsub) {
            this.workspaceEventUnsub();
        }

        if (this.windowEventUnsub) {
            this.windowEventUnsub();
        }
        Object.values(this.workspaceIdToTimer).forEach((t) => {
            clearTimeout(t);
        });
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

    private async checkMaximumAmount() {
        if (!this.settings?.maximumActiveWorkspaces?.threshold) {
            return;
        }

        this.logger?.trace(`Checking for maximum active workspaces rule. The threshold is ${this.settings?.maximumActiveWorkspaces?.threshold}`);

        const commandId = generate();
        const result = await this.workspacesController.getAllWorkspacesSummaries({}, commandId);
        const snapshotsPromises = result.summaries.map(s => this.workspacesController.getWorkspaceSnapshot({ itemId: s.id }, commandId));
        const snapshots = await Promise.all(snapshotsPromises);

        const eligibleForHibernation = snapshots.filter((s) => this.canBeHibernated(s));

        if (eligibleForHibernation.length <= this.settings?.maximumActiveWorkspaces.threshold) {
            return;
        }

        this.logger?.trace(`Found ${eligibleForHibernation.length} eligible for hibernation workspaces`);

        const hibernationPromises = eligibleForHibernation
            .sort(this.compare)
            .slice(0, eligibleForHibernation.length - this.settings.maximumActiveWorkspaces.threshold)
            .map((w) => this.tryHibernateWorkspace(w.id));

        await Promise.all(hibernationPromises);
    }

    private async tryHibernateWorkspace(workspaceId: string): Promise<void> {
        const snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspaceId }, generate());

        if (!await this.canBeHibernated(snapshot)) {
            return;
        }

        try {
            const workspaceId = snapshot.id;
            this.logger?.trace(`trying to hibernate workspace ${workspaceId}`);
            await this.workspacesController.hibernateWorkspace({ workspaceId }, generate());
            this.logger?.trace(`workspace ${workspaceId} was hibernated successfully`);
        } catch (error) {
            this.logger?.trace(error);
        }
    }

    private async canBeHibernated(snapshot: WorkspaceSnapshotResult) {
        const isWorkspaceHibernated = await this.isWorkspaceHibernated(snapshot.config);
        const isWorkspaceSelected = await this.isWorkspaceSelected(snapshot.config);
        const isWorkspaceEmpty = await this.isWorkspaceEmpty(snapshot);

        return !isWorkspaceHibernated && !isWorkspaceSelected && !isWorkspaceEmpty;
    }

    private async isWorkspaceHibernated(workspaceId: string | WorkspaceConfigResult) {
        let config: WorkspaceConfigResult;

        if (typeof workspaceId === "string") {
            const snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspaceId }, generate());
            config = snapshot.config;
        } else {
            config = workspaceId;
        }

        return config.isHibernated;
    }

    private async isWorkspaceSelected(workspaceId: string | WorkspaceConfigResult) {
        let config: WorkspaceConfigResult;

        if (typeof workspaceId === "string") {
            const snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspaceId }, generate());
            config = snapshot.config;
        } else {
            config = workspaceId;
        }
        return config.isSelected;
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

    private async getWorkspacesInFrame(frameId: string) {
        const result = await this.workspacesController.getAllWorkspacesSummaries({}, generate());

        const snapshotPromises = result.summaries.reduce((acc, s) => {
            if (s.config.frameId === frameId) {
                acc.push(this.workspacesController.getWorkspaceSnapshot({ itemId: s.id }, generate()));
            }

            return acc;
        }, [] as Array<Promise<WorkspaceSnapshotResult>>);

        return await Promise.all(snapshotPromises);
    }

    private async addTimersForWorkspacesInFrame(data: WorkspaceEventPayload) {
        if (!this.settings?.idleWorkspaces?.idleMSThreshold) {
            return;
        }

        const workspaceData = data.payload as WorkspaceStreamData;
        const workspacesInFrame = await this.getWorkspacesInFrame(workspaceData.frameSummary.id);

        await Promise.all(workspacesInFrame.map(async (w) => {
            if (!await this.canBeHibernated(w) || this.workspaceIdToTimer[w.id]) {
                return;
            }
            const timeout = setTimeout(() => {
                this.logger?.trace(`Timer triggered will try to hibernated ${w.id}`);
                this.tryHibernateWorkspace(w.id);
                delete this.workspaceIdToTimer[w.id];
            }, this.settings?.idleWorkspaces?.idleMSThreshold);

            this.workspaceIdToTimer[w.id] = timeout;

            this.logger?.trace(`Starting workspace idle timer ( ${this.settings?.idleWorkspaces?.idleMSThreshold}ms ) for workspace ${w.id}`);
        }));
    }
}
