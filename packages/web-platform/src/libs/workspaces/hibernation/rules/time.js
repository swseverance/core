"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorkspaceIdleTimeRule {
    constructor(enabled, threshold) {
        this.enabled = enabled;
        this.threshold = threshold * (60 * 1000);
    }
    get name() {
        return "WorkspaceIdleTimeRule";
    }
    async shouldHibernate(workspace) {
        const diff = (new Date()).getTime() - workspace.lastActive;
        return diff > this.threshold;
    }
    toString() {
        return `name: ${this.name}, enabled: ${this.enabled}, threshold: ${this.threshold}`;
    }
}
exports.WorkspaceIdleTimeRule = WorkspaceIdleTimeRule;
//# sourceMappingURL=time.js.map