import { Injectable } from "@angular/core";
import { Glue42Store } from '@glue42/ng';
import { GlueStatus, Client, Channel } from './types';

@Injectable()
export class GlueService {

    constructor(private readonly glueStore: Glue42Store) {
        const counter = sessionStorage.getItem("counter");
        if (!counter) {
            sessionStorage.setItem("counter", "0");
        }
    }

    public get glueStatus(): GlueStatus {
        return this.glueStore.getInitError() ? "unavailable" : "available";
    }

    public getAllChannels(): Promise<Channel[]> {
        return this.glueStore.getGlue().channels.list();
    }

    public joinChannel(name: string): Promise<void> {
        return this.glueStore.getGlue().channels.join(name);
    }

    public leaveChannel(): Promise<void> {
        return this.glueStore.getGlue().channels.leave();
    }

    public async sendSelectedClient(client: Client): Promise<void> {
        // const foundMethod = this.glueStore.getGlue().interop.methods().find((method) => method.name === "SelectClient");

        // if (foundMethod) {
        //     await this.glueStore.getGlue().interop.invoke(foundMethod, { client });
        // }

        await Promise.all([
            this.glueStore.getGlue().contexts.update('SelectedClient', client),
            this.glueStore.getGlue().channels.publish(client)
        ]);
    }

    public async openStockWindow(): Promise<void> {
        const name = `Stocks-${this.getNextCounter()}`;
        await this.glueStore.getGlue().windows.open(name, "http://localhost:4100");
    }

    private getNextCounter(): number {
        const counter = 1 + Number(sessionStorage.getItem("counter"));
        sessionStorage.setItem("counter", counter.toString());
        return counter;
    }
}
