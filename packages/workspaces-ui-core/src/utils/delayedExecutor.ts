interface Action<T> {
    id: string;
    action: () => Promise<T>;
}

interface ExecutionOptions {
    batchSize: number;
    initialDelay: number;
    executionInterval: number;
}

export class DelayedExecutor<T> {
    private actionsInProgress: Array<Action<T>> = [];

    public async startExecution(actions: Array<Action<T>>, executionOptions: ExecutionOptions) {
        const batchesArray = this.splitInBatches(actions, executionOptions.batchSize);

        await this.waitFor(executionOptions.initialDelay);

        const results = batchesArray.reduce<Promise<T[]>>(async (acc, batch) => {
            const awaited = await acc;
            awaited.push(...await this.executeBatch(batch));
            await this.waitFor(executionOptions.executionInterval);
            return Promise.resolve(awaited);
        }, Promise.resolve([]));

        return results.then(() => {
            this.actionsInProgress = [];
        });
    }

    public isActionInProgress(id: string) {
        return this.actionsInProgress.some((a) => a.id === id);
    }

    private executeBatch(batch: Array<Action<T>>): Promise<T[]> {
        this.actionsInProgress = batch;
        return Promise.all(batch.map((b) => b.action()));
    }

    private splitInBatches(actions: Array<Action<T>>, batchSize: number): Array<Array<Action<T>>> {
        return actions.reduce((acc, a, i) => {
            if (i % batchSize === 0) {
                acc.push([a]);
            } else {
                const lastArray = acc.pop();
                lastArray.push(a);
                acc.push(lastArray);
            }

            return acc;
        }, [] as Array<Array<Action<T>>>);
    }

    private waitFor(ms: number): Promise<void> {
        return new Promise((res) => {
            setTimeout(() => {
                res();
            }, ms);
        });
    }
}
