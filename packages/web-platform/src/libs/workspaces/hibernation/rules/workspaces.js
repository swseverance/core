"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const stateResolver_1 = require("../../stateResolver");
class MaximumActiveWorkspacesRule {
    constructor(enabled, threshold) {
        this.enabled = enabled;
        this.threshold = threshold;
    }
    get name() {
        return "MaximumActiveWorkspacesRule";
    }
    async shouldHibernate(workspace) {
        const frame = await store_1.default.getFrameByWorkspaceId(workspace.id);
        const workspacesCount = await this.getActiveWorkspacesCount(frame);
        return workspacesCount > this.threshold;
    }
    toString() {
        return `name: ${this.name}, enabled: ${this.enabled}, threshold: ${this.threshold}`;
    }
    async getActiveWorkspacesCount(frame) {
        const notHibernatedWorkspaces = (await frame.getWorkspaces([])).filter((w) => !frame.getHibernatedConfig(w.id));
        const notEmptyWorkspaces = await notHibernatedWorkspaces.reduce(async (acc, w) => {
            const result = await acc;
            const snapshot = await stateResolver_1.default.getWorkspaceSnapshot(w.id);
            const isWorkspaceEmpty = snapshot.children.length === 0;
            if (!isWorkspaceEmpty) {
                result.push(w);
            }
            return result;
        }, Promise.resolve([]));
        return notEmptyWorkspaces.length;
    }
}
exports.MaximumActiveWorkspacesRule = MaximumActiveWorkspacesRule;
//# sourceMappingURL=workspaces.js.map