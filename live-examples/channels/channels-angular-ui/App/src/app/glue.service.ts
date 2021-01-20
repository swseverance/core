import { Injectable } from "@angular/core";
import { Glue42Store } from '@glue42/ng';

@Injectable()
export class GlueService {
    constructor(private readonly glueStore: Glue42Store) {}

    public getAllChannels() {
        return (this.glue as any).channels.list();
    }

    public leaveChannel() {
        return (this.glue as any).channels.leave();
    }

    public joinChannel(name: string) {
        return (this.glue as any).channels.join(name);
    }

    private get glue() {
        return this.glueStore.getGlue();
    }
}