import GoldenLayout from "@glue42/golden-layout";
import store from "./state/store";
import { idAsString } from "./utils";

export class WorkspacesUIExecutor {
    public static readonly HibernationIconClass = "lm_hibernationIcon";
    public static readonly SaveWorkspaceButtonLabel = "save";
    private readonly hibernatedWorkspaceIconLabel = "hibernated";

    public showWorkspaceSaveButton(workspaceId: string): void {
        const workspaceTab = store.getWorkspaceTabElement(workspaceId);

        if (workspaceTab.element.hasClass(WorkspacesUIExecutor.HibernationIconClass)) {
            return;
        }

        workspaceTab.element.children(".lm_saveButton").show();
    }

    public hideWorkspaceSaveButton(workspaceId: string): void {
        const workspaceTab = store.getWorkspaceTabElement(workspaceId);

        if (workspaceTab.element.hasClass(WorkspacesUIExecutor.HibernationIconClass)) {
            return;
        }
        workspaceTab.element.children(".lm_saveButton").hide();
    }

    public showHibernationIcon(workspaceId: string): void {
        const tab = store.getWorkspaceTabElement(workspaceId);

        if (!tab) {
            return;
        }

        const saveButton = tab.element.children(".lm_saveButton");

        if (!saveButton.is(":visible")) {
            saveButton.show();
        }

        saveButton.addClass(WorkspacesUIExecutor.HibernationIconClass);
        saveButton.attr("title", this.hibernatedWorkspaceIconLabel);
    }

    public showSaveIcon(workspaceId: string): void {
        const tab = store.getWorkspaceTabElement(workspaceId);
        const workspace = store.getById(workspaceId);

        if (!tab) {
            return;
        }

        const saveButton = tab.element.children(".lm_saveButton");
        saveButton.removeClass(WorkspacesUIExecutor.HibernationIconClass);

        saveButton.attr("title", WorkspacesUIExecutor.SaveWorkspaceButtonLabel);

        if (workspace.layout && (workspace.layout.config.workspacesOptions as any).showSaveButton === false) {
            saveButton.hide();
        }
    }

    public showWorkspaceCloseButton(workspaceId: string): void {
        const tab = store.getWorkspaceTabElement(workspaceId);

        if (!tab) {
            return;
        }

        const closeButton = tab.element.children(".lm_close_tab");

        closeButton.show();
    }

    public hideWorkspaceCloseButton(workspaceId: string): void {
        const tab = store.getWorkspaceTabElement(workspaceId);

        if (!tab) {
            return;
        }

        const closeButton = tab.element.children(".lm_close_tab");

        closeButton.hide();
    }

    public makeContentInvisible(): void {
        $(".lm_item_container .lm_content .lm_item_container .lm_content").addClass("transparent-color");
    }

    public showWindowCloseButton(windowId: string | GoldenLayout.Component): void {
        let windowContentItem;
        if (typeof windowId === "string") {
            windowContentItem = store.getWindowContentItem(windowId);
        } else {
            windowContentItem = windowId;
        }

        windowContentItem.tab.closeElement.show();
    }

    public hideWindowCloseButton(windowId: string | GoldenLayout.Component): void {
        let windowContentItem;
        if (typeof windowId === "string") {
            windowContentItem = store.getWindowContentItem(windowId);
        } else {
            windowContentItem = windowId;
        }

        windowContentItem.tab.closeElement.hide();
    }

    public showMaximizeButton(itemId: string | GoldenLayout.Stack): void {
        let containerContentItem;
        if (typeof itemId === "string") {
            containerContentItem = store.getContainer(itemId);
        } else {
            containerContentItem = itemId;
        }

        if (containerContentItem.type !== "stack") {
            throw new Error(`Cannot show maximize button of ${containerContentItem.type} ${containerContentItem.config.id}`);
        }

        const maximiseButton = containerContentItem.header.element.children(".lm_controls").children(".lm_maximise");
        if (!maximiseButton) {
            return;
        }

        maximiseButton.show();
    }

    public hideMaximizeButton(itemId: string | GoldenLayout.Stack): void {
        let containerContentItem;
        if (typeof itemId === "string") {
            containerContentItem = store.getContainer(itemId);
        } else {
            containerContentItem = itemId;
        }

        if (containerContentItem.type !== "stack") {
            throw new Error(`Cannot hide maximize button of ${containerContentItem.type} ${containerContentItem.config.id}`);
        }

        const maximiseButton = containerContentItem.header.element.children(".lm_controls").children(".lm_maximise");
        if (!maximiseButton) {
            return;
        }

        maximiseButton.hide();
    }

    public showEjectButton(itemId: string | GoldenLayout.Stack): void {
        let containerContentItem;
        if (typeof itemId === "string") {
            containerContentItem = store.getContainer(itemId);
        } else {
            containerContentItem = itemId;
        }

        if (containerContentItem.type !== "stack") {
            throw new Error(`Cannot show eject button of ${containerContentItem.type} ${containerContentItem.config.id}`);
        }
        const ejectButton = containerContentItem.header.element.children(".lm_controls").children(".lm_popout");
        if (!ejectButton) {
            return;
        }

        ejectButton.show();
    }

    public hideEjectButton(itemId: string | GoldenLayout.Stack): void {
        let containerContentItem;
        if (typeof itemId === "string") {
            containerContentItem = store.getContainer(itemId);
        } else {
            containerContentItem = itemId;
        }

        if (containerContentItem.type !== "stack") {
            throw new Error(`Cannot hide eject button of ${containerContentItem.type} ${containerContentItem.config.id}`);
        }
        const ejectButton = containerContentItem.header.element.children(".lm_controls").children(".lm_popout");
        if (!ejectButton) {
            return;
        }

        ejectButton.hide();
    }

    public showAddWindowButton(itemId: string | GoldenLayout.Stack): void {
        let containerContentItem;
        if (typeof itemId === "string") {
            containerContentItem = store.getContainer(itemId);
        } else {
            containerContentItem = itemId;
        }

        if (containerContentItem.type !== "stack") {
            throw new Error(`Cannot show add window button of ${containerContentItem.type} ${containerContentItem.config.id}`);
        }

        if ((containerContentItem.config.workspacesConfig as any).showAddWindowButton === false) {
            return;
        }

        const button = containerContentItem.header.element.children(".lm_controls").children(".lm_add_button");
        if (!button) {
            return;
        }

        button.show();
    }

    public hideAddWindowButton(itemId: string | GoldenLayout.Stack): void {
        let containerContentItem;
        if (typeof itemId === "string") {
            containerContentItem = store.getContainer(itemId);
        } else {
            containerContentItem = itemId;
        }

        if (containerContentItem.type !== "stack") {
            throw new Error(`Cannot hide add window button of ${containerContentItem.type} ${containerContentItem.config.id}`);
        }
        const button = containerContentItem.header.element.children(".lm_controls").children(".lm_add_button");
        if (!button) {
            return;
        }

        button.hide();
    }

    public showWindowCloseButtons(workspaceId: string): void {
        const workspace = store.getById(workspaceId);
        if (!workspace?.layout) {
            return;
        }

        const allComponentItems = workspace.layout.root.getItemsByType("component");

        allComponentItems.forEach((componentItem) => {
            this.showWindowCloseButton(idAsString(componentItem.config.id));
        });
    }

    public hideWindowCloseButtons(workspaceId: string): void {
        const workspace = store.getById(workspaceId);
        if (!workspace?.layout) {
            return;
        }

        const allComponentItems = workspace.layout.root.getItemsByType("component");

        allComponentItems.forEach((componentItem) => {
            this.hideWindowCloseButton(idAsString(componentItem.config.id));
        });
    }

    public showEjectButtons(workspaceId: string): void {
        const workspace = store.getById(workspaceId);
        if (!workspace?.layout) {
            return;
        }

        const allComponentItems = workspace.layout.root.getItemsByType("stack");

        allComponentItems.forEach((stackItem) => {
            this.showEjectButton(idAsString(stackItem.config.id));
        });
    }

    public hideEjectButtons(workspaceId: string): void {
        const workspace = store.getById(workspaceId);
        if (!workspace?.layout) {
            return;
        }

        const allComponentItems = workspace.layout.root.getItemsByType("stack");

        allComponentItems.forEach((stackItem) => {
            this.hideEjectButton(idAsString(stackItem.config.id));
        });
    }

    public showAddWindowButtons(workspaceId: string): void {
        const workspace = store.getById(workspaceId);
        if (!workspace?.layout) {
            return;
        }

        const allComponentItems = workspace.layout.root.getItemsByType("stack");

        allComponentItems.forEach((stackItem) => {
            this.showAddWindowButton(idAsString(stackItem.config.id));
        });
    }

    public hideAddWindowButtons(workspaceId: string): void {
        const workspace = store.getById(workspaceId);
        if (!workspace?.layout) {
            return;
        }

        const allComponentItems = workspace.layout.root.getItemsByType("stack");

        allComponentItems.forEach((stackItem) => {
            this.hideAddWindowButton(idAsString(stackItem.config.id));
        });
    }
}

export default new WorkspacesUIExecutor();
