import { ITransport } from './Transport';
import { Cache, ICacheEntryCollection } from '../Cache';

export class TransportWorker {
    public isReady = false

    private isAsync = false;
    private lastModified: Date = null;
    private restorePromise: Promise<any> = null;
    private coll: ICacheEntryCollection;
    private flushRunner: AsyncRunner;

    constructor (private cache: Cache, private transport: ITransport) {
        this.isAsync = Boolean(this.transport.isAsync);
        this.flushRunner = new AsyncRunner(() => this.flushInner(), this.transport.debounceMs ?? 500);
    }

    restore () {
        if (this.isReady) {
            return;
        }
        if (this.isAsync) {
            throw new Error('Transport is Async');
        }
        let coll = this.transport.restore();
        this.cache.setCollection(coll);
        this.isReady = true;
    }

    async restoreAsync () {
        return this.restorePromise ?? (this.restorePromise = (async () => {
            if (this.isReady) {
                return;
            }
            if (this.isAsync === false) {
                this.restore();
                return;
            }
            let coll = await this.transport.restoreAsync();
            if (this.isReady) {
                return;
            }
            this.cache.setCollection(coll);
            this.isReady = true;
        })());
    }

    flush (coll: ICacheEntryCollection) {
        this.isReady = true;
        this.lastModified = new Date();
        this.coll = coll;

        if (this.transport.debounceMs === 0) {
            this.transport.flush(coll);
            return;
        }
        this.flushRunner.run();
    }
    async flushAsync (coll: ICacheEntryCollection) {
        this.isReady = true;
        this.lastModified = new Date();
        this.coll = coll;
        return this.flushRunner.run();
    }

    private flushInner () {
        if (this.transport.isAsync) {
            return this.transport.flushAsync(this.coll);
        }
        this.transport.flush(this.coll);
    }

}


class AsyncRunner {
    isWaiting = false;
    isBusy = false;
    timeout = null;
    dfr: Deferred;
    shouldRunNext = false;

    constructor (public fn: () => Promise<any>, public debounce: number) {

    }

    run () {
        if (this.isWaiting && !this.isBusy) {
            this.reset();
            return this.run();
        }
        if (this.isBusy) {
            this.shouldRunNext = true;
            return this.dfr.promise;
        }
        this.isWaiting = true;
        this.isBusy = false;
        this.dfr = new Deferred;
        this.timeout = setTimeout(() => this.runInner(), this.debounce);
        return this.dfr.promise;
    }
    private reset () {
        clearTimeout(this.timeout);
        this.isWaiting = false;
        this.isBusy = false;
        this.shouldRunNext = false;
    }
    private async runInner () {
        this.isWaiting = false;
        this.isBusy = true;
        try {
            await this.fn();
        } catch (error) {
            console.error('Transport error', error);
        } finally {
            const runNext = this.shouldRunNext;
            this.dfr.resolve();
            this.reset();
            if (runNext) {
                this.run();
            }
        }
    }
}
class Deferred {
    promise: Promise<any>
    resolve: Function
    reject: Function

    constructor () {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}