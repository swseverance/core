import GoldenLayout, { ContentItem } from "@glue42/golden-layout";
import { ContainerSummary } from "../types/internal";
import { idAsString } from "../utils";
import store from "./store";
import { WorkspaceWindowWrapper } from "./windowWrapper";

export class WorkspaceContainerWrapper {
    constructor(
        private readonly containerContentItem: GoldenLayout.Row | GoldenLayout.Stack | GoldenLayout.Column,
        private readonly frameId: string,
        private readonly workspaceId?: string) {
    }

    public get allowDrop() {
        return (this.containerContentItem.config.workspacesConfig as any).allowDrop ?? true;
    }

    public set allowDrop(value: boolean | undefined) {
        (this.containerContentItem.config.workspacesConfig as any).allowDrop = value;
    }

    public get allowExtract() {
        return (this.containerContentItem.config.workspacesConfig as any).allowExtract;
    }

    public set allowExtract(value: boolean | undefined) {
        (this.containerContentItem.config.workspacesConfig as any).allowExtract = value;

        this.populateChildrenAllowExtact(value);
    }

    public get showMaximizeButton() {
        if (this.containerContentItem.config.type !== "stack") {
            throw new Error(`Accessing showMaximizeButton of container ${this.containerContentItem.type} ${this.containerContentItem.config.id} the property is available only for stacks`);
        }
        return (this.containerContentItem.config.workspacesConfig as any).showMaximizeButton ?? true;
    }

    public set showMaximizeButton(value: boolean | undefined) {
        if (this.containerContentItem.config.type !== "stack") {
            throw new Error(`Setting showMaximizeButton of container ${this.containerContentItem.type} ${this.containerContentItem.config.id} the property is available only for stacks`);
        }
        (this.containerContentItem.config.workspacesConfig as any).showMaximizeButton = value;
    }

    public get showEjectButton() {
        if (this.containerContentItem.config.type !== "stack") {
            throw new Error(`Accessing showEjectButton of container ${this.containerContentItem.type} ${this.containerContentItem.config.id} the property is available only for stacks`);
        }
        return (this.containerContentItem.config.workspacesConfig as any).showEjectButton ?? true;
    }

    public set showEjectButton(value: boolean | undefined) {
        if (this.containerContentItem.config.type !== "stack") {
            throw new Error(`Setting showEjectButton of container ${this.containerContentItem.type} ${this.containerContentItem.config.id} the property is available only for stacks`);
        }
        (this.containerContentItem.config.workspacesConfig as any).showEjectButton = value;
    }

    public get showAddWindowButton() {
        if (this.containerContentItem.config.type !== "stack") {
            throw new Error(`Accessing showAddWindowButton of container ${this.containerContentItem.type} ${this.containerContentItem.config.id} the property is available only for stacks`);
        }
        return (this.containerContentItem.config.workspacesConfig as any).showAddWindowButton ?? true;
    }

    public set showAddWindowButton(value: boolean | undefined) {
        if (this.containerContentItem.config.type !== "stack") {
            throw new Error(`Setting showAddWindowButton of container ${this.containerContentItem.type} ${this.containerContentItem.config.id} the property is available only for stacks`);
        }
        (this.containerContentItem.config.workspacesConfig as any).showAddWindowButton = value;
    }

    public get positionIndex() {
        return this.containerContentItem?.parent?.contentItems.indexOf(this.containerContentItem) || 0;
    }

    public get summary(): ContainerSummary {
        const workspaceId = this.workspaceId ?? store.getByContainerId(idAsString(this.containerContentItem.config.id))?.id;
        const userFriendlyType = this.getUserFriendlyType(this.containerContentItem?.type || "workspace");

        let config: ContainerSummary["config"] = {
            workspaceId,
            frameId: this.frameId,
            positionIndex: this.positionIndex,
            allowDrop: this.allowDrop,
        };

        const type = userFriendlyType === "window" ? undefined : userFriendlyType;
        if (type === "group") {
            config = {
                ...config,
                allowExtract: this.allowExtract,
                showMaximizeButton: this.showMaximizeButton,
                showEjectButton: this.showEjectButton,
                showAddWindowButton: this.showAddWindowButton
            };
        }
        return {
            itemId: idAsString(this.containerContentItem.config.id),
            type: userFriendlyType === "window" ? undefined : userFriendlyType,
            config
        };
    }

    public get config(): GoldenLayout.ItemConfig {
        const workspace = store.getByContainerId(this.containerContentItem.config.id) ||
            store.getByWindowId(idAsString(this.containerContentItem.config.id));

        const workspaceConfig = workspace.layout.toConfig();

        return this.findElementInConfig(idAsString(this.containerContentItem.config.id), workspaceConfig);
    }

    public populateChildrenAllowDrop(value: boolean | undefined) {
        const lockChildren = (children: ContentItem[]) => {
            children.forEach((c) => {
                if (c.type === "component") {
                    return;
                }

                const wrapper = new WorkspaceContainerWrapper(c, this.frameId);

                wrapper.allowDrop = value;

                lockChildren(c.contentItems);
            });
        };

        lockChildren(this.containerContentItem.contentItems);
    }

    private populateChildrenAllowExtact(value: boolean | undefined) {
        const lockChildren = (children: ContentItem[]) => {
            children.forEach((c) => {
                if (c.type === "component") {
                    const wrapper = new WorkspaceWindowWrapper(c, this.frameId);

                    wrapper.allowExtract = value;

                    return;
                }

                lockChildren(c.contentItems);
            });
        };

        lockChildren(this.containerContentItem.contentItems);
    }

    private getUserFriendlyType(type: "row" | "column" | "component" | "stack" | "root" | "workspace"): "row" | "window" | "column" | "group" | "workspace" {
        if (type === "stack") {
            return "group";
        } else if (type === "root") {
            return "workspace";
        } else if (type === "component") {
            return "window";
        }

        return type;
    }

    private findElementInConfig(elementId: string, config: GoldenLayout.Config): GoldenLayout.ItemConfig {
        const search = (glConfig: GoldenLayout.Config | GoldenLayout.ItemConfig): any => {
            if (idAsString(glConfig.id) === elementId) {
                return [glConfig];
            }

            const contentToTraverse = (glConfig as any).content || [];

            return contentToTraverse.reduce((acc: any, ci: any) => [...acc, ...search(ci)], []);
        };

        const searchResult = search(config);

        return searchResult.find((i: GoldenLayout.ItemConfig) => i.id);
    }
}
