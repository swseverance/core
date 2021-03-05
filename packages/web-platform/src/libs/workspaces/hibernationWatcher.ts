import { WindowStreamData, WorkspaceConfigResult, WorkspaceEventPayload, WorkspaceSnapshotResult, WorkspaceStreamData } from "./types";
import { WorkspacesController } from "./controller";
import { generate } from "shortid";
import { Glue42WebPlatform } from "../../../platform";
import logger from "../../shared/logger";
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
    private maximumAmountCheckInProgress = false;

    public start(
        workspacesController: WorkspacesController,
        settings?: Glue42WebPlatform.Workspaces.HibernationConfig,
    ): void {
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

                this.addTimersForWorkspacesInFrame(workspaceData.frameSummary.id);
                this.checkMaximumAmount();
            }
        });

        this.windowEventUnsub = this.workspacesController.subscribeForWindowEvent((e) => {
            const isWindowOpened = e.action === "opened" || e.action === "added";

            if (isWindowOpened) {
                this.checkMaximumAmount();
                this.addTimersForWorkspacesInFrame((e.payload as WindowStreamData).windowSummary.config.frameId);
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
            if (t === undefined || t === null) {
                return;
            }
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
        if (this.maximumAmountCheckInProgress) {
            return;
        }
        if (!this.settings?.maximumActiveWorkspaces?.threshold) {
            return;
        }
        this.maximumAmountCheckInProgress = true;

        try {
            await this.checkMaximumAmountCore(this.settings.maximumActiveWorkspaces.threshold);
        } finally {
            this.maximumAmountCheckInProgress = false;
        }
    }

    private async checkMaximumAmountCore(threshold: number) {
        this.logger?.trace(`Checking for maximum active workspaces rule. The threshold is ${this.settings?.maximumActiveWorkspaces?.threshold}`);

        const commandId = generate();
        const result = await this.workspacesController.getAllWorkspacesSummaries({}, commandId);
        const snapshotsPromises = result.summaries.map(s => this.workspacesController.getWorkspaceSnapshot({ itemId: s.id }, commandId));
        const snapshots = await Promise.all(snapshotsPromises);

        const eligibleForHibernation = snapshots.reduce((acc, s) => {
            const result = acc;
            if (!this.isWorkspaceHibernated(s.config) && !this.isWorkspaceEmpty(s)) {
                result.push(s);
            }
            return result;
        }, [] as WorkspaceSnapshotResult[]);

        if (eligibleForHibernation.length <= threshold) {
            return;
        }

        this.logger?.trace(`Found ${eligibleForHibernation.length} eligible for hibernation workspaces`);

        const hibernationPromises = eligibleForHibernation
            .sort(this.compare)
            .slice(0, eligibleForHibernation.length - threshold)
            .map((w) => this.tryHibernateWorkspace(w.id));

        await Promise.all(hibernationPromises);
    }

    private async tryHibernateWorkspace(workspaceId: string): Promise<void> {
        const snapshot = await this.workspacesController.getWorkspaceSnapshot({ itemId: workspaceId }, generate());

        if (!this.canBeHibernated(snapshot)) {
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

    private canBeHibernated(snapshot: WorkspaceSnapshotResult) {
        const isWorkspaceHibernated = this.isWorkspaceHibernated(snapshot.config);
        const isWorkspaceSelected = this.isWorkspaceSelected(snapshot.config);
        const isWorkspaceEmpty = this.isWorkspaceEmpty(snapshot);

        return !isWorkspaceHibernated && !isWorkspaceSelected && !isWorkspaceEmpty;
    }

    private isWorkspaceHibernated(workspaceSnapshot: WorkspaceConfigResult) {
        return workspaceSnapshot.isHibernated;
    }

    private isWorkspaceSelected(workspaceSnapshot: WorkspaceConfigResult) {
        return workspaceSnapshot.isSelected;
    }

    private isWorkspaceEmpty(workspaceSnapshot: WorkspaceSnapshotResult) {
        return !workspaceSnapshot.children.length;
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

    private async addTimersForWorkspacesInFrame(frameId: string) {
        if (!this.settings?.idleWorkspaces?.idleMSThreshold) {
            return;
        }

        const workspacesInFrame = await this.getWorkspacesInFrame(frameId);

        workspacesInFrame.map((w) => {
            if (!this.canBeHibernated(w) || this.workspaceIdToTimer[w.id]) {
                return;
            }
            const timeout = setTimeout(() => {
                this.logger?.trace(`Timer triggered will try to hibernated ${w.id}`);
                this.tryHibernateWorkspace(w.id);
                delete this.workspaceIdToTimer[w.id];
            }, this.settings?.idleWorkspaces?.idleMSThreshold);

            this.workspaceIdToTimer[w.id] = timeout;

            this.logger?.trace(`Starting workspace idle timer ( ${this.settings?.idleWorkspaces?.idleMSThreshold}ms ) for workspace ${w.id}`);
        });
    }
}
