import { IMemoizeWrapper } from '../model/IMemoizeWrapper';
import { Cache, ICacheOpts } from '../Cache'

export interface IMemoizeOpts {
    perInstance?: boolean
    clearOnReject?: boolean
}

export function fn_memoize<T extends Function>(fn:T, opts: ICacheOpts & IMemoizeOpts = {}, key?: string): IMemoizeWrapper & T {
    let _perInstance = opts?.perInstance ?? false;
    let _clearOnReject = opts?.clearOnReject ?? false;
    let _cache = new Cache(opts);
    let _caches = [] as Cache[];

    const Wrapper: IMemoizeWrapper & T = <any> function (...args) {
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
        const cached = cache.get(id);
        if (cached != null) {
            return cached;
        }
        let val = fn.apply(this, args);
        if (_clearOnReject === true && val != null && typeof val === 'object' && typeof val.then === 'function') {
            val = val.then(null, err => {
                cache.clear(id);
                return Promise.reject(err);
            });
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

