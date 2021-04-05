import { Base } from "./base/base";
import { Glue42Workspaces } from "../../workspaces.d";
import { rowLockConfigDecoder } from "../shared/decoders";

interface PrivateData {
    base: Base;
}

const privateData = new WeakMap<Row, PrivateData>();

const getBase = (model: Row): Base => {
    return privateData.get(model).base;
};

export class Row implements Glue42Workspaces.Row {

    constructor(base: Base) {
        privateData.set(this, { base });
    }

    public get type(): "row" {
        return "row";
    }

    public get id(): string {
        return getBase(this).getId(this);
    }

    public get frameId(): string {
        return getBase(this).getFrameId(this);
    }

    public get workspaceId(): string {
        return getBase(this).getWorkspaceId(this);
    }

    public get positionIndex(): number {
        return getBase(this).getPositionIndex(this);
    }

    public get children(): Glue42Workspaces.WorkspaceElement[] {
        return getBase(this).getAllChildren(this);
    }
    public get parent(): Glue42Workspaces.Workspace | Glue42Workspaces.WorkspaceBox {
        return getBase(this).getMyParent(this);
    }
    public get frame(): Glue42Workspaces.Frame {
        return getBase(this).getMyFrame(this);
    }
    public get workspace(): Glue42Workspaces.Workspace {
        return getBase(this).getMyWorkspace(this);
    }
    public get allowDrop(): boolean {
        return getBase(this).getAllowDrop(this);
    }

    public addWindow(definition: Glue42Workspaces.WorkspaceWindowDefinition): Promise<Glue42Workspaces.WorkspaceWindow> {
        return getBase(this).addWindow(this, definition, "row");
    }

    public async addGroup(definition?: Glue42Workspaces.BoxDefinition): Promise<Glue42Workspaces.Group> {
        if (definition?.type && definition.type !== "group") {
            throw new Error(`Expected a group definition, but received ${definition.type}`);
        }
        return getBase(this).addParent<Glue42Workspaces.Group>(this, "group", "row", definition);
    }

    public async addColumn(definition?: Glue42Workspaces.BoxDefinition): Promise<Glue42Workspaces.Column> {
        if (definition?.type && definition.type !== "column") {
            throw new Error(`Expected a column definition, but received ${definition.type}`);
        }
        return getBase(this).addParent<Glue42Workspaces.Column>(this, "column", "row", definition);
    }

    public async addRow(): Promise<Row> {
        throw new Error("Adding rows as row children is not supported");
    }

    public removeChild(predicate: (child: Glue42Workspaces.WorkspaceElement) => boolean): Promise<void> {
        return getBase(this).removeChild(this, predicate);
    }

    public maximize(): Promise<void> {
        return getBase(this).maximize(this);
    }

    public restore(): Promise<void> {
        return getBase(this).restore(this);
    }

    public close(): Promise<void> {
        return getBase(this).close(this);
    }

    public lock(config?: Glue42Workspaces.RowLockConfig | ((config: Glue42Workspaces.RowLockConfig) => Glue42Workspaces.RowLockConfig)): Promise<void> {
        let lockConfigResult = undefined;

        if (typeof config === "function") {
            const currentLockConfig = {
                allowDrop: this.allowDrop,
            };

            lockConfigResult = config(currentLockConfig);
        } else {
            lockConfigResult = config;
        }

        const verifiedConfig = lockConfigResult === undefined ? undefined : rowLockConfigDecoder.runWithException(lockConfigResult);

        return getBase(this).lockContainer(this, verifiedConfig);
    }

}
