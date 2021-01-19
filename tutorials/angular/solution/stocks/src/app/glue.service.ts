import { Injectable, NgZone } from "@angular/core";
import { Glue42Store } from '@glue42/ng';
import { Glue42Web } from "@glue42/web";
import { GlueStatus, Stock, Client, Channel } from './types';
import { Observable, Subject } from 'rxjs';
import { DataService } from './data.service';

@Injectable()
export class GlueService {

    private readonly selectedClientSource = new Subject<Client>();
    private readonly priceUpdateSource = new Subject<{ Ask: number, Bid: number }>();

    constructor(private readonly glueStore: Glue42Store, private _zone: NgZone, private readonly dataService: DataService) { }

    public get glueStatus(): GlueStatus {
        return this.glueStore.getInitError() ? "unavailable" : "available";
    }

    public onClientSelected(): Observable<Client> {
        return this.selectedClientSource.asObservable();
    }

    public onPriceUpdate(): Observable<{ Ask: number, Bid: number }> {
        return this.priceUpdateSource.asObservable();
    }

    public async openStockDetails(stock: Stock): Promise<void> {
        const windowName = `${stock.BPOD} Details`;
        const URL = "http://localhost:4242/stocks/details/";

        const openSettings: Glue42Web.Windows.Settings = {
            width: 600,
            height: 600
        };

        openSettings.context = stock;

        const stockWindowExists = this.glueStore.getGlue().windows.list().find(w => w.name === windowName);

        if (!stockWindowExists) {
            // Open a new window by providing a name and URL. The name must be unique.
            await this.glueStore.getGlue().windows.open(windowName, URL, openSettings);
        }
    }

    public async getMyContext() {
        return await this.glueStore.getGlue().windows.my().getContext();
    }

    public async subscribeToLivePrices(stock: Stock): Promise<Glue42Web.Interop.Subscription> {

        const stream = this.glueStore.getGlue().interop.methods().find((method) => method.name === "LivePrices" && method.supportsStreaming);

        if (!stream) {
            return;
        }

        const subscription = await this.glueStore.getGlue().interop.subscribe(stream);

        subscription.onData((streamData) => {
            const newPrices = streamData.data.stocks;

            const selectedStockPrice = newPrices.find((prices) => prices.RIC === stock.RIC);

            this._zone.run(() => this.priceUpdateSource.next({
                Ask: Number(selectedStockPrice.Ask),
                Bid: Number(selectedStockPrice.Bid)
            }));

        });

        return subscription;
    }

    public subscribeToChannelContext() {
        this.glueStore.getGlue().channels.subscribe((client) => {
            this._zone.run(() => this.selectedClientSource.next(client));
        });
    }

    public async subscribeToSharedContext() {
        await this.glueStore.getGlue().contexts.subscribe('SelectedClient', (client) => {
            this._zone.run(() => this.selectedClientSource.next(client));
        });
    }

    public async registerClientSelect() {
        await this.glueStore.getGlue().interop.register("SelectClient", (args) => {
            this._zone.run(() => this.selectedClientSource.next(args.client));
        });
    }

    public async createPriceStream() {
        const priceStream = await this.glueStore.getGlue().interop.createStream("LivePrices");
        this.dataService.onStockPrices().subscribe((priceUpdate) => priceStream.push(priceUpdate));
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
}
