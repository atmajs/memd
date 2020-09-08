import { Args } from './fn/Args';
import { ITransport } from './persistance/Transport';
import { TransportWorker } from './persistance/TransportWorker';

export interface ICacheOpts {
    /** In Seconds */
    maxAge?: number
    monitors?: ICacheChangeEventMonitor[]
    keyResolver?: (...args) => string
    persistance?: ITransport
}
export interface ICacheChangeEventMonitor {
    on (event: 'change', fn: Function)
    off (event: 'change', fn: Function)
}

export interface ICacheEntry <T = any> {
    timestamp: number
    value: T
}
export interface ICacheEntryCollection<T = any> {
    [key: string]: ICacheEntry<T>
}

export class Cache <T = any> {
    private _cache: ICacheEntryCollection<T> = {};
    private _transport: TransportWorker;

    constructor (public options: ICacheOpts = {}) {
        if (this.options.monitors) {
            this.onChanged = this.onChanged.bind(this);
            options.monitors.forEach(x => x.on('change', this.onChanged));
        }
        if (this.options.persistance) {
            this._transport = new TransportWorker(this, this.options.persistance);
        }
    }

    resolveKey (...args) {
        let key = this.options?.keyResolver?.(...args);
        return key ?? Args.getKey(args);
    }

    get (key: string): T {
        if (this._transport != null && this._transport.isReady === false) {
            this._transport.restore();
        }
        let entry = this._cache[key];
        if (entry == null) {
            return null;
        }
        if (this.options.maxAge != null && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge) {
            this.clear(key);
            return null;
        }
        return entry.value;
    }
    async getAsync (key: string): Promise<T> {
        if (this._transport != null && this._transport.isReady === false) {
            await this._transport.restoreAsync();
        }
        let entry = this._cache[key];
        if (entry == null) {
            return null;
        }
        if (this.options.maxAge != null && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge) {
            await this.clearAsync(key);
            return null;
        }
        return entry.value;
    }
    set (key: string, val: T): T {
        this._cache[key] = {
            timestamp: Date.now(),
            value: val
        };

        this._transport?.flush(this._cache);
        return val;
    }
    async setAsync (key: string, val: T): Promise<T> {
        this._cache[key] = {
            timestamp: Date.now(),
            value: val
        };

        await this._transport?.flushAsync(this._cache);
        return val;
    }
    setCollection (coll: ICacheEntryCollection) {
        this._cache = coll ?? {};
    }

    clear (key?: string) {
        if (typeof key === 'string') {
            this._cache[key] = null;
        } else {
            this._cache = {};
        }
        this._transport?.flush(this._cache);
    }
    async clearAsync (key?: string) {
        if (typeof key === 'string') {
            this._cache[key] = null;
        } else {
            this._cache = {};
        }
        await this._transport?.flushAsync(this._cache);
    }

    destroy () {
        this.clear();
        this.options.monitors?.forEach(x => x.off('change', this.onChanged))
    }

    private onChanged (key?: string) {
        this.clear(key);
    }
}
