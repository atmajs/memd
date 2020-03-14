import { ITransport } from './Transport';
import { Cache, ICacheEntryCollection } from '../Cache';
import { deco_debounce } from '../deco/debounce';

export class TransportWorker {
    public isReady = false
    private isAsync = false;
    private lastModified: Date = null;
    private restorePromise: Promise<any> = null;

    constructor (private cache: Cache, private transport: ITransport) {
        this.isAsync = Boolean(this.transport.isAsync);
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

        if (this._flushTimeoutMs === 0) {
            this.flushInner(coll);
            return;
        }

        clearTimeout(this._flushTimeout);
        this._flushTimeout = setTimeout(() => {
            this.flushInner(coll);
        });
    }

    private _flushTimeoutMs = this.transport.debounceMs ?? 500;
    private _flushTimeout = null;
    private _flushIsBusy = false;
    private _flushNext: ICacheEntryCollection = null;

    private flushInner (coll: ICacheEntryCollection) {
        if (this.isAsync) {
            this.flushInnerAsync(coll);
            return;
        }
        this.flushInnerSync(coll);
    }
    private flushInnerSync (coll: ICacheEntryCollection) {
        this.transport.flush(coll);
    }
    private flushInnerAsync (coll: ICacheEntryCollection) {
        if (this._flushIsBusy) {
            this._flushNext = coll;
            return;
        }
        try {
            this._flushIsBusy = true;
            this.transport.flush(coll);
        } catch (error) {

        } finally {
            this._flushIsBusy = false;

            let next = this._flushNext;
            if (next) {
                this._flushNext = null;
                this.flushInnerAsync(next);
            }
        }

    }
}