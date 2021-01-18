import { Injectable } from "@angular/core";
import { Glue42Store } from '@glue42/ng';
import { Glue42Web } from '@glue42/web';
import { Glue42Workspaces } from '@glue42/workspaces-api';
import { Client } from 'shared/interfaces/ng-interfaces';

@Injectable()
export class GlueService {

    constructor(private readonly glueStore: Glue42Store) { }

    public async setUpContextRetrieval(handleContext: (context: any) => any): Promise<{ contextId: string, globalUnsubscribe: () => void }> {
        const startUpCtx = await this.getMyWindowContext();

        if (startUpCtx) {
            await handleContext(startUpCtx);
        }

        if (startUpCtx?.contextId) {
            const globalUnsubscribe = await this.processContextId(startUpCtx.contextId, handleContext);
            return { contextId: startUpCtx.contextId, globalUnsubscribe };
        }

        const wspContext = await this.getMyWorkspaceContext();

        if (wspContext?.contextId) {
            const globalUnsubscribe = await this.processContextId(wspContext.contextId, handleContext);
            return { contextId: wspContext.contextId, globalUnsubscribe };
        }

        return this.waitForContextId(handleContext);
    }

    public async bringBackToWorkspace(id: string, grandParentId?: string): Promise<void> {
        if (!id) {
            console.warn("Cannot bring back to a workspace, because no id was provided.");
            return;
        }

        console.log(`Finding the right workspace for id: ${id}`);
        const workspace = await this.glue.workspaces.getWorkspace((wsp) => wsp.id === id);

        if (!workspace) {
            console.warn(`Cannot find an open workspace with id: ${id}, aborting bringing back the window`);
            return;
        }

        let hostGroup: Glue42Workspaces.Group;
        console.log("workspace found");
        if (grandParentId) {
            console.log("have grand parent?");
            const oldParent = workspace.getBox((box) => box.id === grandParentId);

            if (oldParent) {
                hostGroup = await oldParent.addGroup();
            }
        }
        console.log("creating a group");
        hostGroup = hostGroup || await workspace.addGroup();
        console.log("adding the window to the group");
        await hostGroup.addWindow({ windowId: this.glue.windows.my().id });
    }

    public async setWorkspaceContextId(contextId: string) {
        const inWsp = await this.glue.workspaces.inWorkspace();

        if (!inWsp) {
            return;
        }

        const wsp = await this.glue.workspaces.getMyWorkspace();

        const allWindows = wsp.getAllWindows().map((w) => w.getGdWindow());

        await Promise.all(
            allWindows.map((w) => w.updateContext({ contextId }))
        );
    }

    public async updateAllWorkspaceWindowsContext(context: { client: Client, selectedStockSymbol?: string }, workspace?: Glue42Workspaces.Workspace): Promise<void> {

        const wsp = workspace || await this.glue.workspaces.getMyWorkspace();

        const anyWindow = wsp.getAllWindows()[0];

        await anyWindow.forceLoad();

        const ctx = await anyWindow.getGdWindow().getContext();

        const contextId = ctx.contextId;

        if (!contextId) {
            console.warn(`Cannot update workspace context, because a window is no contextId was detected`);
            return;
        }

        await this.updateContext(contextId, context);
    }

    public async setMyWorkspaceId(): Promise<void> {
        const inWsp = await this.glue.workspaces.inWorkspace();

        if (!inWsp) {
            return;
        }
        const myWorkspace = await this.glue.workspaces.getMyWorkspace();

        const workspaceId = myWorkspace.id;

        const myGroup = myWorkspace.getWindow((w) => w.id === this.glue.windows.my().id).parent as Glue42Workspaces.Row | Glue42Workspaces.Column | Glue42Workspaces.Group;

        const grandParentId = myGroup.parent.id;

        await this.glue.windows.my().updateContext({ workspaceId, grandParentId });
    }

    public async getMyWorkspaceContext(): Promise<{ client?: Client, selectedStockSymbol?: string, contextId?: string }> {

        const inWsp = await this.glue.workspaces.inWorkspace();

        if (!inWsp) {
            return;
        }

        const myWsp = await this.glue.workspaces.getMyWorkspace();

        const anyWindow = myWsp.getAllWindows()[0];

        return await anyWindow.getGdWindow().getContext();
    }

    public async setContext(contextName: string, initialData: any): Promise<void> {
        await this.glue.contexts.set(contextName, initialData);
    }

    public async updateMyContext(context: any): Promise<void> {
        await this.glue.windows.my().updateContext(context);
    }

    public subscribeMyContext(callback: (ctx: any) => void): () => void {
        return this.glue.windows.my().onContextUpdated(callback);
    }

    public subscribeGlobalContext(contextName: string, callback: (data: any) => void): Promise<() => void> {
        return this.glue.contexts.subscribe(contextName, (data) => {
            callback(data);
        });
    }

    public async updateContext(contextName: string, data: any): Promise<void> {
        await this.glue.contexts.update(contextName, data);
    }

    public async getMyWindowContext(): Promise<any> {
        return await this.glue.windows.my().getContext();
    }

    public async openWindow(name: string, url: string, context: any): Promise<void> {
        await this.glue.windows.open(name, url, { context });
    }

    public async isInWorkspace(): Promise<boolean> {
        return await this.glue.workspaces.inWorkspace();
    }

    public async getMyWorkspace(): Promise<Glue42Workspaces.Workspace> {
        return await this.glue.workspaces.getMyWorkspace();
    }

    public async isClientWorkspaceOpen(): Promise<boolean> {
        const allSummaries: Glue42Workspaces.WorkspaceSummary[] = await this.glue.workspaces.getAllWorkspacesSummaries();
        return allSummaries.length !== 0;
    }

    public async getLastWorkspaceInFrame(frameId: string): Promise<Glue42Workspaces.Workspace> {
        const workspaces: Glue42Workspaces.Workspace[] = await this.glue.workspaces.getAllWorkspaces((wsp) => wsp.frameId === frameId);
        return workspaces.sort((a, b) => b.positionIndex - a.positionIndex)[0];
    }

    public async focusLastFrame(): Promise<Glue42Workspaces.Frame> {
        const allFrames = await this.glue.workspaces.getAllFrames();

        if (!allFrames || !allFrames.length) {
            return;
        }

        const lastFrame = allFrames.sort((a, b) => {
            const aIncrementor: number = +a.id.slice(a.id.lastIndexOf("-") + 1);
            const bIncrementor: number = +b.id.slice(b.id.lastIndexOf("-") + 1);

            return bIncrementor - aIncrementor;
        })[0];

        await lastFrame.focus();

        return lastFrame;
    }

    public async setMyTitle(title: string): Promise<void> {
        await this.glue.windows.my().setTitle(title);
    }

    public async closeMe(): Promise<void> {
        await this.glue.windows.my().close();
    }

    public async addTransactionsToWorkspace(contextId: string): Promise<void> {
        const myWorkspace = await this.glue.workspaces.getMyWorkspace();

        const transactionsExist = myWorkspace.getWindow((w) => w.appName === "transactions");

        if (transactionsExist) {
            return;
        }

        const group = await myWorkspace.addGroup();

        await group.addWindow({ appName: "transactions", context: { contextId } });
    }

    public getWorkspaceBuilder(builderConfig: Glue42Workspaces.BuilderConfig): Glue42Workspaces.WorkspaceBuilder {
        return this.glue.workspaces.getBuilder(builderConfig) as Glue42Workspaces.WorkspaceBuilder;
    }

    public get glue(): Glue42Web.API {
        return this.glueStore.getGlue();
    }

    private waitForContextId(handleContext: (context: any) => any): Promise<{ contextId: string, globalUnsubscribe: () => void }> {
        return new Promise((resolve) => {
            const localUnsubscribe = this.subscribeMyContext((ctx) => {

                if (!ctx || !ctx.contextId) {
                    return;
                }

                localUnsubscribe();
                this.processContextId(ctx.contextId, handleContext)
                    .then((globalUnsubscribe) => {
                        resolve({ contextId: ctx.contextId, globalUnsubscribe })
                    })
                    .catch(console.warn);
            });
        });
    }

    private async processContextId(id: string, handleContext: (context: any) => any) {
        return await this.subscribeGlobalContext(id, (ctx) => {
            handleContext(ctx);
            this.updateMyContext(ctx);
        });
    }
}