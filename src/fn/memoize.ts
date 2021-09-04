import { IMemoizeWrapper } from '../model/IMemoizeWrapper';
import { Cache, ICacheOpts } from '../Cache'

export interface IMemoizeOpts {
    perInstance?: boolean
    clearOnReady?: boolean
    clearOnReject?: boolean
    clearOn?: (val) => boolean
    thisArg?: any
}

export function fn_memoize<T extends Function>(fn:T, opts: ICacheOpts & IMemoizeOpts = {}, key?: string): IMemoizeWrapper & T {

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

    const Wrapper: IMemoizeWrapper & T = <any> function (...args) {
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
        const id = cache.resolveKey(...args);
        const cached = cache.get(id);
        if (cached != null) {
            return cached;
        }
        let isPromise = null as boolean;
        let val = fn.apply(_thisArg ?? this, args);
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
        const id = _cache.resolveKey(...args);
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
        const id = cache.resolveKey(...args);
        const cached = await cache.getAsync(id, ...args);
        if (cached != null) {
            return cached;
        }
        let isPromise = null as boolean;
        let val = fn.apply(_thisArg ?? this, args);
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
        const id = _cache.resolveKey(...args);
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
