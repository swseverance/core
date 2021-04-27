import { Row } from "../models/row";
import { Column } from "../models/column";
import { Group } from "../models/group";
import { ParentPrivateData, WorkspacePrivateData, WindowPrivateData, FramePrivateData, RemapChildData, RemapWorkspaceData } from "../types/privateData";
import { Workspace } from "../models/workspace";
import { Window } from "../models/window";
import { Frame } from "../models/frame";
import { SwimlaneWindowSnapshotConfig, ParentSnapshotConfig, FrameSummaryResult } from "../types/protocol";
import { Child, SubParentTypes } from "../types/builders";

export class PrivateDataManager {
    private readonly parentsData = new WeakMap<SubParentTypes, ParentPrivateData>();
    private readonly workspacesData = new WeakMap<Workspace, WorkspacePrivateData>();
    private readonly windowsData = new WeakMap<Window, WindowPrivateData>();
    private readonly framesData = new WeakMap<Frame, FramePrivateData>();
    // Without this collection there is no way to get a window instance before its loaded
    // e.g addWindow returns a window however this window doesn't have a placement id needed for force load
    private readonly windowPlacementIdData: { [key: string]: Window } = {};

    public deleteData<T>(model: T): void {
        if (model instanceof Window) {
            const keyForDeleting =
                Object.keys(this.windowPlacementIdData)
                    .find((k) => this.windowPlacementIdData[k] === model);

            if (keyForDeleting) {
                delete this.windowPlacementIdData[keyForDeleting];
            }

            this.windowsData.delete(model);
        }

        if (model instanceof Workspace) {
            this.workspacesData.delete(model);
        }

        if (model instanceof Row || model instanceof Column || model instanceof Group) {
            this.parentsData.delete(model);
        }

        if (model instanceof Frame) {
            this.framesData.delete(model);
        }
    }

    public setWindowData(model: Window, data: WindowPrivateData): void {

        this.windowPlacementIdData[data.id] = model;
        this.windowsData.set(model, data);
    }

    public setWorkspaceData(model: Workspace, data: WorkspacePrivateData): void {
        this.workspacesData.set(model, data);
    }

    public setParentData(model: SubParentTypes, data: ParentPrivateData): void {
        this.parentsData.set(model, data);
    }

    public setFrameData(model: Frame, data: FramePrivateData): void {
        this.framesData.set(model, data);
    }

    public getWindowData(model: Window): WindowPrivateData {
        return this.windowsData.get(model);
    }

    public getWindowByPlacementId(placementId: string): Window {
        return this.windowPlacementIdData[placementId];
    }

    public getWorkspaceData(model: Workspace): WorkspacePrivateData {
        return this.workspacesData.get(model);
    }

    public getParentData(model: SubParentTypes): ParentPrivateData {
        return this.parentsData.get(model);
    }

    public getFrameData(model: Frame): FramePrivateData {
        return this.framesData.get(model);
    }

    public remapChild(model: Child, newData: RemapChildData): void {
        if (model instanceof Window) {
            const data = this.windowsData.get(model);
            data.parent = newData.parent || data.parent;
            data.config = newData.config as SwimlaneWindowSnapshotConfig || data.config;
        }

        if (model instanceof Row || model instanceof Column || model instanceof Group) {
            const data = this.parentsData.get(model);
            data.parent = newData.parent || data.parent;
            data.config = newData.config as ParentSnapshotConfig || data.config;
            data.children = newData.children || data.children;
        }
    }

    public remapFrame(model: Frame, newData: FrameSummaryResult): void {
        const data = this.framesData.get(model);
        data.summary = newData;
    }

    public remapWorkspace(model: Workspace, newData: RemapWorkspaceData): void {
        const data = this.workspacesData.get(model);
        data.frame = newData.frame || data.frame;
        data.config = newData.config || data.config;
        data.children = newData.children || data.children;
    }
}
