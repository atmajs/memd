import { Args } from './fn/Args';
import { ITransport } from './persistance/ITransport';
import { IStore } from "./persistance/IStore";
import { TransportWorker } from './persistance/TransportWorker';
import { StoreWorker } from './persistance/StoreWorker';

export interface ICacheOpts {
    /** In Seconds */
    maxAge?: number
    monitors?: ICacheChangeEventMonitor[]
    keyResolver?: (...args) => string
    persistance?: ITransport
    store?: IStore
    doNotWaitSave?: boolean
    trackRef?: boolean
}
export interface ICacheChangeEventMonitor {
    on (event: 'change', fn: Function)
    off (event: 'change', fn: Function)
}

export interface ICacheEntry <T = any> {
    timestamp?: number
    value: T
}
export interface ICacheEntryCollection<T = any> {
    [key: string]: ICacheEntry<T>
}

export class Cache <T = any> {

    static caches: Cache[]

    private _cache: ICacheEntryCollection<T> = {};

    /** We save/read ALL cached object to the backed store */
    private _transport: TransportWorker;

    /** We save/read single key based values to the backed store */
    private _store: StoreWorker;

    public isAsync = false;

    constructor (public options: ICacheOpts = {}) {
        if (this.options.monitors) {
            this.onChanged = this.onChanged.bind(this);
            options.monitors.forEach(x => x.on('change', this.onChanged));
        }
        if (this.options.persistance) {
            this._transport = new TransportWorker(this, this.options.persistance);
            this.isAsync = this._transport.isAsync;
        }
        if (this.options.store) {
            this._store = new StoreWorker(this.options.store, options);
            this.isAsync = this._store.isAsync;
        }
        if (options.trackRef) {
            Cache.caches.push(this);
        }
    }

    resolveKey (...args) {
        let key = this.options?.keyResolver?.(...args);
        return key ?? Args.getKey(args);
    }

    get (key: string, ...args): T {
        if (this._transport != null && this._transport.isReady === false) {
            this._transport.restore();
        }
        let entry = this._cache[key];
        if (entry == null) {
            if (this._store == null) {
                return null;
            }
            entry = this._store.get(key, ...args);
            if (entry == null) {
                return null;
            }
        }
        if (this.options.maxAge != null && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge) {
            this.clear(key);
            return null;
        }
        return entry.value;
    }
    async getAsync (key: string, ...args): Promise<T> {
        if (this._transport != null && this._transport.isReady === false) {
            await this._transport.restoreAsync();
        }
        let entry = this._cache[key];
        if (entry == null) {
            if (this._store == null) {
                return null;
            }

            entry = await this._store.getAsync(key, ...args);
            if (entry == null) {
                return null;
            }
        }
        if (this.options.maxAge != null && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge) {
            await this.clearAsync(key);
            return null;
        }
        return entry.value;
    }
    set (key: string, val: T): T {
        const cached = {
            timestamp: Date.now(),
            value: val
        };
        this._cache[key] = cached;

        this.persist(key, cached, false);
        return val;
    }
    private async persist (key: string, entry: ICacheEntry, isAsync: boolean) {
        const transport = this._transport;
        const store = this._store;
        if (transport == null && store == null) {
            return;
        }
        let val = entry.value;
        let isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
        if (isPromise) {
            val = await val;
            entry = {
                value: val,
                timestamp: entry.timestamp,
            };
        }
        if (isAsync) {
            await this._transport?.flushAsync(key, entry);
            await this._store?.saveAsync(key, entry);
        } else {
            this._transport?.flush(key, entry);
            this._store?.save(key, entry);
        }
    }

    async setAsync (key: string, val: T): Promise<T> {
        const cached = {
            timestamp: Date.now(),
            value: val
        };
        this._cache[key] = cached;
        this.persist(key, cached, true);
        return val;
    }
    setRestored (coll: ICacheEntryCollection) {
        this._cache = {
            ...(coll ?? {}),
            ...(this._cache ?? {}),
        };
    }
    getCollection () {
        return this._cache;
    }

    clear (key?: string) {
        if (typeof key === 'string') {
            this._cache[key] = null;
        } else {
            this._cache = {};
        }
        this._transport?.clear();
        this._store?.clear(key);
    }
    async clearAsync (key?: string) {
        if (typeof key === 'string') {
            this._cache[key] = null;
        } else {
            this._cache = {};
        }
        await this._transport?.clearAsync();
        this._store?.clearAsync(key);
    }

    destroy () {
        this.clear();
        this.options.monitors?.forEach(x => x.off('change', this.onChanged))
    }

    private onChanged (key?: string) {
        this.clear(key);
    }

    async flushAsync () {
        await this._transport?.flushAsyncAll();
    }
}
