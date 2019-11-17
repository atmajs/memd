import { IMemoizeWrapper } from '../model/IMemoizeWrapper';
import { Cache, ICacheOpts } from '../Cache'

export function fn_memoize<T extends Function>(fn:T, opts: ICacheOpts = {}): IMemoizeWrapper<T> {
    let _cache = new Cache(opts);
    const Wrapper: IMemoizeWrapper<T> = function (...args) {
        const id = _cache.resolveKey(...args);
        
        return _cache.get(id) ?? (_cache.set(id, fn.apply(this, args)));
    };
    Wrapper.clearArgs = function (...args) {
        const id = _cache.resolveKey(...args);
        _cache.clear(id);
    };
    Wrapper.clearAll = function () {
        _cache.clear();
    };
    return Wrapper;
};

