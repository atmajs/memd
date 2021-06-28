import { ITransport } from './ITransport';
import { Cache, ICacheEntry, ICacheEntryCollection } from '../Cache';

export class TransportWorker {
    public isReady = false
    public isAsync = false;

    private lastModified: Date = null;
    private restorePromise: Promise<any> = null;
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
        this.cache.setRestored(coll);
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
            this.cache.setRestored(coll);
            this.isReady = true;
        })());
    }

    flush (key: string, entry: ICacheEntry) {
        this.isReady = true;
        this.lastModified = new Date();

        if (this.transport.debounceMs === 0) {
            this.transport.flush(this.cache.getCollection());
            return;
        }
        this.flushRunner.run();
    }
    async flushAsync (force?: boolean) {
        if (this.isReady === false) {
            await this.restoreAsync();
        }
        this.lastModified = new Date();
        return this.flushRunner.run(force);
    }

    clear () {
        return this.flushRunner.run();
    }
    async clearAsync () {
        return this.clear();
    }

    getCollection () {
        return this.cache.getCollection();
    }

    private flushInner () {
        let coll = this.cache.getCollection();
        if (this.transport.isAsync) {
            return this.transport.flushAsync(coll);
        }
        this.transport.flush(coll);
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

    async run (force?: boolean):Promise<any> {
        if (this.isWaiting && !this.isBusy) {
            this.defer(force);
            return this.dfr.promise;
        }
        if (this.isBusy) {
            this.shouldRunNext = true;
            return this.dfr.promise;
        }
        this.isWaiting = true;
        this.isBusy = false;
        this.dfr = new Deferred;

        this.defer(force)
        return this.dfr.promise;
    }
    private defer (force?: boolean) {
        if (this.isWaiting) {
            clearTimeout(this.timeout);
        }
        if (force === true) {
            this.runInner();
            return;
        }
        this.timeout = setTimeout(() => this.runInner(), this.debounce);
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
        }
        const runNext = this.shouldRunNext;
        this.dfr.resolve(null);
        this.reset();
        if (runNext) {
            this.run();
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


function wait (ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
