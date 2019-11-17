import { Args } from './fn/Args';

export interface ICacheOpts {
    maxAge?: number
    monitors?: ICacheChangeEventMonitor[]
    keyResolver?: (...args) => string
}
export interface ICacheChangeEventMonitor {
    on (event: 'change', fn: Function)
    off (event: 'change', fn: Function)
}

export interface ICacheEntry <T = any> {
    timestamp: number
    value: T
}

export class Cache <T = any> {
    private _cache: { [key: string]: ICacheEntry<T> } = {};

    constructor (public options: ICacheOpts = {}) {
        if (this.options.monitors) {
            this.onChanged = this.onChanged.bind(this);
            options.monitors.forEach(x => x.on('change', this.onChanged));
        }
    }

    resolveKey (...args) {
        let key = this.options?.keyResolver?.(...args);
        return key ?? Args.getKey(args);
    }

    get (key: string): T {
        let entry = this._cache[key];
        if (entry == null) {
            return null;
        }
        if (this.options.maxAge && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge) {
            this.clear(key);
            return null;
        }
        return entry.value;
    }
    set (key: string, val: T): T {
        this._cache[key] = {
            timestamp: Date.now(),
            value: val
        };
        return val;
    }

    clear (key?: string) {
        if (typeof key === 'string') {
            this._cache[key] = null;
            return;
        }
        this._cache = {};
    }

    destroy () {
        this.clear();
        this.options.monitors?.forEach(x => x.off('change', this.onChanged))
    }

    private onChanged (key?: string) {
        this.clear(key);
    }
}