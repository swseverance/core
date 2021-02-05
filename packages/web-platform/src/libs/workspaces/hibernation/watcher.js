"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_1 = require("./rules/memory");
const time_1 = require("./rules/time");
const workspaces_1 = require("./rules/workspaces");
const log4js = require("log4js");
const manager_1 = require("../manager");
const stateResolver_1 = require("../stateResolver");
const executor_1 = require("../executor");
class WorkspaceHibernationWatcher {
    constructor(settings, frame) {
        var _a, _b;
        this.settings = settings;
        this.frame = frame;
        this.asyncSequalizer = executor_1.default.facadeQueue;
        this.tryHibernate = async () => {
            if (!this.frame.webContents || this.frame.webContents.isDestroyed()) {
                this.stop();
                return;
            }
            const workspaces = await this.frame.getWorkspaces([]);
            const candidatePromises = workspaces.map(async (workspace) => {
                const rule = await this.shouldHibernate(workspace);
                if (rule) {
                    return [workspace, rule];
                }
            });
            const hibernationCandidates = (await Promise.all(candidatePromises)).filter((c) => c);
            await Promise.all(this.tryHibernateWorkspaces(hibernationCandidates));
        };
        this.logger = log4js.getLogger("workspaces-hibernation-watcher");
        this.isStarted = false;
        this.rules = ((_b = (_a = this.settings) === null || _a === void 0 ? void 0 : _a.rules) === null || _b === void 0 ? void 0 : _b.map((r) => this.getHibernationRule(r))) || [];
    }
    get started() {
        return this.isStarted;
    }
    getLogger() {
        return this.logger;
    }
    start() {
        var _a;
        this.logger.info("try to start hibernation watcher");
        try {
            this.logger.info(`try to start hibernation watcher with following settings: ${this.settings.toString()}`);
            if (((_a = this.settings) === null || _a === void 0 ? void 0 : _a.enabled) && !this.isStarted) {
                this.startCore();
                this.logger.info(`hibernation watcher was started successfully`);
            }
        }
        catch (error) {
            this.logger.error(error);
        }
        finally {
            this.isStarted = true;
        }
    }
    stop() {
        var _a;
        try {
            this.logger.info(`try to stop hibernation watcher`);
            if (((_a = this.settings) === null || _a === void 0 ? void 0 : _a.enabled) && this.isStarted) {
                this.stopCore();
                this.logger.info(`hibernation watcher was stopped successfully`);
            }
        }
        catch (error) {
            this.logger.error(error);
        }
        finally {
            this.isStarted = false;
        }
    }
    startCore() {
        let interval = this.settings.interval;
        if (interval && interval > -1) {
            interval = interval * 60000;
            this.timer = setInterval(() => this.asyncSequalizer.enqueue(this.tryHibernate), interval);
        }
    }
    stopCore() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
    tryHibernateWorkspaces(workspaces) {
        return workspaces
            .sort((ws1, ws2) => this.compare(ws1[0], ws2[0]))
            .slice(0, this.settings.workspacesToClose)
            .map((workspaceToClose) => this.tryHibernateWorkspace(workspaceToClose));
    }
    compare(ws1, ws2) {
        if (ws1.lastActive > ws2.lastActive) {
            return 1;
        }
        if (ws1.lastActive < ws2.lastActive) {
            return -1;
        }
        return 0;
    }
    async tryHibernateWorkspace(tuple) {
        try {
            const workspace = tuple[0];
            const rule = tuple[1];
            const workspaceId = workspace.id;
            this.logger.info(`try hibernate workspace ${workspaceId}, rule ${rule.name}`);
            await manager_1.default.hibernateWorkspace(workspaceId);
            this.logger.info(`workspace ${workspaceId} was hibernated successfully`);
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async shouldHibernate(workspace) {
        // first check global rules
        const isWorkspaceHibernated = this.frame.getHibernatedConfig(workspace.id);
        const isWorkspaceSelected = (await stateResolver_1.default.getActiveWorkspaceId(workspace.id, this.frame)) === workspace.id;
        const isWorkspaceEmpty = (await stateResolver_1.default.getWorkspaceSnapshot(workspace.id)).children.length === 0;
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
            }
            else if (r.enabled && await r.shouldHibernate(workspace)) {
                return r;
            }
        }, Promise.resolve(undefined));
    }
    getHibernationRule(ruleConfig) {
        switch (ruleConfig.type) {
            case "InsufficientSystemMemory": {
                return new memory_1.InsufficientSystemMemoryRule(ruleConfig.enabled, ruleConfig.threshold);
            }
            case "MaximumActiveWorkspaces": {
                return new workspaces_1.MaximumActiveWorkspacesRule(ruleConfig.enabled, ruleConfig.threshold);
            }
            case "WorkspaceIdleTime": {
                return new time_1.WorkspaceIdleTimeRule(ruleConfig.enabled, ruleConfig.threshold);
            }
            default: {
                this.logger.info(`rule ${ruleConfig.type} is not supported`);
                return undefined;
            }
        }
    }
}
exports.WorkspaceHibernationWatcher = WorkspaceHibernationWatcher;
//# sourceMappingURL=watcher.js.map