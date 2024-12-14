import { IMemoizeWrapper } from '../model/IMemoizeWrapper';
import { Cache, ICacheOpts } from '../Cache'
import { Methods } from '../utils/types';

export interface IMemoizeOpts<TMethod extends (...args) => any = any, TThis = any> {
    /** Default: false - we cache result for the prototyped method, means the cache is for all instances. Set this to "true", to make the cache for each entity */
    perInstance?: boolean

    /** Default: false - cache is active only during the promise is in progress */
    clearOnReady?: boolean

    /** Default: false - remove cached result if promise is rejected */
    clearOnReject?: boolean

    /** Method to check if cached result, should be removed from cache */
    clearOn?: (val) => boolean

    thisArg?: TThis

    /** Override key resolver */
    key?: (options: { this?: TThis }, ...args: Parameters<TMethod>) => string

    /** Gets the prefix for a key, for example to distinguish keys per instances */
    keyPfx?: (self: TThis) => string

    keyOptions?: {
        deep?: number
        serialize?: {
            [selector: string]: (val: any) => string
        }
    }
}

export function fn_memoize<TMethod extends (...args) => any, TThis = any>(
    fn:TMethod,
    opts: ICacheOpts & IMemoizeOpts<TMethod, TThis> = {},
    key?: string
): IMemoizeWrapper & TMethod {

    let _cache = new Cache(opts);
    if (_cache.isAsync) {
        return fn_memoizeAsync(_cache, fn, opts, key);
    }

    let _perInstance = opts?.perInstance ?? false;
    let _clearOnReady = opts?.clearOnReady ?? false;
    let _clearOnReject = opts?.clearOnReject ?? false;
    let _clearOn = opts?.clearOn ?? null;
    let _caches = [] as Cache[];
    let _thisArg = opts?.thisArg;

    const Wrapper: IMemoizeWrapper & TMethod = <any> function (...args: Parameters<TMethod>) {
        let cache = _cache;
        if (_perInstance === true) {
            const prop = `__$mem_${key}`;
            cache = this[prop];
            if (cache == null) {
                cache = new Cache(opts);
                Object.defineProperty(this, prop, {
                    value: cache,
                    enumerable: false
                });
                _caches.push(cache);
            }
        }
        const thisArg = _thisArg ?? this;
        const id = (opts?.keyPfx?.(thisArg) ?? '') + (opts?.key?.({ this: thisArg }, ...args) ?? cache.resolveKey(args, opts?.keyOptions));
        const cached = cache.get(id);
        if (cached != null) {
            return cached;
        }
        let isPromise = null as boolean;
        let val = fn.apply(thisArg, args);
        if (_clearOnReject === true) {
            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
            if (isPromise) {
                val = val.then(null, err => {
                    cache.clear(id);
                    return Promise.reject(err);
                });
            }
        }
        if (_clearOnReady === true) {
            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
            if (isPromise) {
                val = val.then(result => {
                    cache.clear(id);
                    return Promise.resolve(result);
                }, err => {
                    cache.clear(id);
                    return Promise.reject(err);
                });
            }
        }
        if (_clearOn != null) {
            isPromise = isPromise ??  (val != null && typeof val === 'object' && typeof val.then === 'function');
            if (isPromise) {
                val = val.then(result => {
                    if (_clearOn(result)) {
                        cache.clear(id);
                    }
                    return result;
                });
            } else if (_clearOn(val)) {
                // don't even set to cache
                return val;
            }
        }

        return cache.set(id, val);
    };
    Wrapper.clearArgs = function (...args) {
        const id = _cache.resolveKey(args);
        _cache.clear(id);
        _caches.forEach(x => x.clear(id));
    };
    Wrapper.clearAll = function () {
        _cache.clear();
        _caches.forEach(x => x.clear());
    };
    return Wrapper;
};


function fn_memoizeAsync<T extends Function>(_cache: Cache, fn:T, opts: ICacheOpts & IMemoizeOpts = {}, key?: string): IMemoizeWrapper & T {

    let _perInstance = opts?.perInstance ?? false;
    let _clearOnReady = opts?.clearOnReady ?? false;
    let _clearOnReject = opts?.clearOnReject ?? false;
    let _clearOn = opts?.clearOn ?? null;
    let _caches = [] as Cache[];
    let _thisArg = opts?.thisArg;

    const Wrapper: IMemoizeWrapper & T = <any> async function (...args) {
        let cache = _cache;
        if (_perInstance === true) {
            let prop = `__$mem_${key}`;
            cache = this[prop];
            if (cache == null) {
                cache = new Cache(opts);
                Object.defineProperty(this, prop, {
                    value: cache,
                    enumerable: false
                });
                _caches.push(cache);
            }
        }
        const thisArg = _thisArg ?? this;
        const id = opts?.key?.({ this: thisArg }, ...args) ?? cache.resolveKey(args, opts?.keyOptions);
        const cached = await cache.getAsync(id, ...args);
        if (cached != null) {
            return cached;
        }
        let isPromise = null as boolean;
        let val = fn.apply(thisArg, args);
        if (_clearOnReject === true) {
            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
            if (isPromise) {
                val = val.then(null, err => {
                    cache.clearAsync(id);
                    return Promise.reject(err);
                });
            }
        }
        if (_clearOnReady === true) {
            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
            if (isPromise) {
                val = val.then(result => {
                    cache.clearAsync(id);
                    return Promise.resolve(result);
                }, err => {
                    cache.clearAsync(id);
                    return Promise.reject(err);
                });
            }
        }
        if (_clearOn != null) {
            isPromise = isPromise ??  (val != null && typeof val === 'object' && typeof val.then === 'function');
            if (isPromise) {
                val = val.then(result => {
                    if (_clearOn(result)) {
                        cache.clearAsync(id);
                    }
                    return result;
                });
            } else if (_clearOn(val)) {
                // don't even set to cache
                return val;
            }
        }

        return cache.setAsync(id, val);
    };
    Wrapper.clearArgs = function (...args) {
        const id = _cache.resolveKey(args);
        _cache.clearAsync(id);
        _caches.forEach(x => x.clearAsync(id));
    };
    Wrapper.clearAll = function () {
        _cache.clearAsync();
        _caches.forEach(x => x.clearAsync());
    };
    return Wrapper;
}

export function fn_clearMemoized (fn: Function, ...args: any[]) {
    if (args.length === 0) {
        (fn as any)?.clearAll?.();
        return;
    }
    (fn as any)?.clearArgs?.(...args);
    return;
}

