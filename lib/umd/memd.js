
// source ./UMD.js
(function (factory) {

    var _name = 'memd',
        _global = typeof window === 'undefined' ? global : window,
        _module = {
            exports: {}
        };

    factory(_module, _module.exports, _global);

    if (typeof module === 'object' && module.exports) {
        module.exports = _module.exports;
    }

    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return _module.exports;
        });
        return;
    }
    
    if (_name) {
        _global[_name] = _module.exports;
    }

}(function (module, exports, global) {

    var _src_Cache = {};
var _src_deco_debounce = {};
var _src_deco_memoize = {};
var _src_deco_queued = {};
var _src_deco_throttle = {};
var _src_fn_Args = {};
var _src_fn_memoize = {};
var _src_fn_queued = {};
var _src_model_Deferred = {};
var _src_persistance_FsTransport = {};
var _src_persistance_LocalStorageTransport = {};
var _src_persistance_StoreWorker = {};
var _src_persistance_TransportWorker = {};
var _src_utils_requireLib = {};
var _src_workers_CachedWorker = {};

// source ./ModuleSimplified.js
var _src_fn_Args;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_fn_Args != null ? _src_fn_Args : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Args = void 0;
var Args;
(function (Args) {
    function getKey(args, keyOptions, selector, ctx) {
        if (ctx == null) {
            ctx = { level: 0, refs: [] };
        }
        if (keyOptions == null) {
            keyOptions = {};
        }
        if (keyOptions.deep == null) {
            keyOptions.deep = 3;
        }
        if (selector == null) {
            selector = '';
        }
        let key = '';
        for (let i = 0; i < args.length; i++) {
            if (i > 0) {
                key += '.';
            }
            ctx.level++;
            key += getKeySingle(args[i], `${selector}.${i}`, keyOptions, ctx);
            ctx.level--;
        }
        return key;
    }
    Args.getKey = getKey;
    function getKeySingle(misc, selector, keyOptions, ctx) {
        if (keyOptions.deep != null && ctx.level > keyOptions.deep) {
            return '';
        }
        if (keyOptions.serialize != null && keyOptions.serialize[selector.substring(1) /* cut trailing '.'*/] != null) {
            return keyOptions.serialize[selector.substring(1)](misc);
        }
        if (misc == null) {
            return '';
        }
        if (typeof misc !== 'object') {
            return misc;
        }
        if (misc instanceof Date) {
            return misc.getTime();
        }
        if (misc instanceof Array) {
            return getKey(misc, keyOptions, selector, ctx);
        }
        let str = '';
        for (let key in misc) {
            ctx.level++;
            str += '.' + getKeySingle(misc[key], `${selector}.${key}`, keyOptions, ctx);
            ctx.level--;
        }
        return str;
    }
})(Args = exports.Args || (exports.Args = {}));
//# sourceMappingURL=Args.js.map
//# sourceMappingURL=Args.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_fn_Args === module.exports) {
        // do nothing if
    } else if (__isObj(_src_fn_Args) && __isObj(module.exports)) {
        Object.assign(_src_fn_Args, module.exports);
    } else {
        _src_fn_Args = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_TransportWorker;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_persistance_TransportWorker != null ? _src_persistance_TransportWorker : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportWorker = void 0;
class TransportWorker {
    cache;
    transport;
    isReady = false;
    isAsync = false;
    lastModified = null;
    restorePromise = null;
    // We duplicate collection, as Cache collections can store also promises.
    coll = {};
    flushRunner;
    constructor(cache, transport) {
        this.cache = cache;
        this.transport = transport;
        this.isAsync = Boolean(this.transport.isAsync);
        this.flushRunner = new AsyncRunner(() => this.flushInner(), this.transport.debounceMs ?? 500);
    }
    restore() {
        if (this.isReady) {
            return;
        }
        if (this.isAsync) {
            throw new Error('Transport is Async');
        }
        let coll = this.transport.restore();
        this.cache.setRestored(coll);
        this.coll = coll ?? {};
        this.isReady = true;
    }
    async restoreAsync() {
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
            this.coll = coll ?? {};
            this.isReady = true;
        })());
    }
    flush(key, entry) {
        this.isReady = true;
        this.lastModified = new Date();
        this.coll[key] = entry;
        if (this.transport.debounceMs === 0) {
            this.transport.flush(this.coll);
            return;
        }
        this.flushRunner.run();
    }
    async flushAsync(key, entry, force) {
        if (this.isReady === false) {
            await this.restoreAsync();
        }
        this.lastModified = new Date();
        this.coll[key] = entry;
        return this.flushRunner.run();
    }
    async flushAllAsync(force) {
        if (this.isReady === false) {
            await this.restoreAsync();
        }
        this.lastModified = new Date();
        return this.flushRunner.run(force);
    }
    clear() {
        return this.flushRunner.run();
    }
    async clearAsync() {
        return this.clear();
    }
    flushInner() {
        let coll = this.coll;
        if (this.transport.isAsync) {
            return this.transport.flushAsync(coll);
        }
        this.transport.flush(coll);
    }
}
exports.TransportWorker = TransportWorker;
class AsyncRunner {
    fn;
    debounce;
    isWaiting = false;
    isBusy = false;
    timeout = null;
    dfr;
    shouldRunNext = false;
    constructor(fn, debounce) {
        this.fn = fn;
        this.debounce = debounce;
    }
    async run(force) {
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
        this.defer(force);
        return this.dfr.promise;
    }
    defer(force) {
        if (this.isWaiting) {
            clearTimeout(this.timeout);
        }
        if (force === true) {
            this.runInner();
            return;
        }
        this.timeout = setTimeout(() => this.runInner(), this.debounce);
    }
    reset() {
        clearTimeout(this.timeout);
        this.isWaiting = false;
        this.isBusy = false;
        this.shouldRunNext = false;
    }
    async runInner() {
        this.isWaiting = false;
        this.isBusy = true;
        try {
            await this.fn();
        }
        catch (error) {
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
    promise;
    resolve;
    reject;
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
//# sourceMappingURL=TransportWorker.js.map
//# sourceMappingURL=TransportWorker.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_persistance_TransportWorker === module.exports) {
        // do nothing if
    } else if (__isObj(_src_persistance_TransportWorker) && __isObj(module.exports)) {
        Object.assign(_src_persistance_TransportWorker, module.exports);
    } else {
        _src_persistance_TransportWorker = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_StoreWorker;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_persistance_StoreWorker != null ? _src_persistance_StoreWorker : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreWorker = void 0;
class StoreWorker {
    store;
    options;
    isAsync = false;
    doNotWaitSave = false;
    constructor(store, options = {}) {
        this.store = store;
        this.options = options;
        this.isAsync = this.store.getAsync != null;
        this.doNotWaitSave = options?.doNotWaitSave === true;
    }
    get(key, ...args) {
        return this.store.get(key);
    }
    getAsync(key, ...args) {
        return this.store.getAsync(key, ...args);
    }
    save(key, val) {
        this.store.save(key, val);
    }
    saveAsync(key, val) {
        let promise = this.store.saveAsync(key, val);
        if (this.doNotWaitSave === true) {
            return null;
        }
        return promise;
    }
    clear(key) {
        this.store.clear(key);
    }
    clearAsync(key) {
        return this.store.clearAsync(key);
    }
}
exports.StoreWorker = StoreWorker;
//# sourceMappingURL=StoreWorker.js.map
//# sourceMappingURL=StoreWorker.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_persistance_StoreWorker === module.exports) {
        // do nothing if
    } else if (__isObj(_src_persistance_StoreWorker) && __isObj(module.exports)) {
        Object.assign(_src_persistance_StoreWorker, module.exports);
    } else {
        _src_persistance_StoreWorker = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_Cache;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_Cache != null ? _src_Cache : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const Args_1 = _src_fn_Args;
const TransportWorker_1 = _src_persistance_TransportWorker;
const StoreWorker_1 = _src_persistance_StoreWorker;
class Cache {
    options;
    static caches = [];
    _cache = {};
    /** We save/read ALL cached object to the backed store */
    _transport;
    /** We save/read single key based values to the backed store */
    _store;
    isAsync = false;
    constructor(options = {}) {
        this.options = options;
        if (this.options.monitors) {
            this.onChanged = this.onChanged.bind(this);
            options.monitors.forEach(x => x.on('change', this.onChanged));
        }
        if (this.options.persistance) {
            this._transport = new TransportWorker_1.TransportWorker(this, this.options.persistance);
            this.isAsync = this._transport.isAsync;
        }
        if (this.options.store) {
            this._store = new StoreWorker_1.StoreWorker(this.options.store, options);
            this.isAsync = this._store.isAsync;
        }
        if (options.trackRef) {
            Cache.caches.push(this);
        }
    }
    resolveKey(args, keyOptions) {
        let key = this.options?.keyResolver?.(...args);
        return key ?? Args_1.Args.getKey(args, keyOptions);
    }
    get(key, ...args) {
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
    async getAsync(key, ...args) {
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
    set(key, val) {
        const cached = {
            timestamp: Date.now(),
            value: val
        };
        this._cache[key] = cached;
        this.persist(key, cached, false);
        return val;
    }
    async persist(key, entry, isAsync) {
        const transport = this._transport;
        const store = this._store;
        if (transport == null && store == null) {
            return;
        }
        let val = entry.value;
        let isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
        if (isPromise) {
            try {
                val = await val;
            }
            catch (error) {
                // do nothing on rejection
                return;
            }
            entry = {
                value: val,
                timestamp: entry.timestamp,
            };
        }
        if (isAsync) {
            await this._transport?.flushAsync(key, entry);
            await this._store?.saveAsync(key, entry);
        }
        else {
            this._transport?.flush(key, entry);
            this._store?.save(key, entry);
        }
    }
    async setAsync(key, val) {
        const cached = {
            timestamp: Date.now(),
            value: val
        };
        this._cache[key] = cached;
        this.persist(key, cached, true);
        return val;
    }
    setRestored(coll) {
        this._cache = {
            ...(coll ?? {}),
            ...(this._cache ?? {}),
        };
    }
    clear(key) {
        if (typeof key === 'string') {
            this._cache[key] = null;
        }
        else {
            this._cache = {};
        }
        this._transport?.clear();
        this._store?.clear(key);
    }
    async clearAsync(key) {
        if (typeof key === 'string') {
            this._cache[key] = null;
        }
        else {
            this._cache = {};
        }
        await this._transport?.clearAsync();
        this._store?.clearAsync(key);
    }
    destroy() {
        this.clear();
        this.options.monitors?.forEach(x => x.off('change', this.onChanged));
    }
    onChanged(key) {
        this.clear(key);
    }
    async flushAsync(force) {
        await this._transport?.flushAllAsync(force);
    }
    static async flushAllAsync() {
        await Promise.all(Cache.caches.map(cache => cache.flushAsync(true)));
    }
    static async resolve(cache, resolver, key = '') {
        let value = await cache.getAsync(key);
        if (value != null) {
            return value;
        }
        let promise = resolver();
        cache.set(key, promise);
        try {
            value = await promise;
        }
        catch (error) {
            cache.clear(key);
            throw error;
        }
        await cache.flushAsync();
        return value;
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map
//# sourceMappingURL=Cache.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_Cache === module.exports) {
        // do nothing if
    } else if (__isObj(_src_Cache) && __isObj(module.exports)) {
        Object.assign(_src_Cache, module.exports);
    } else {
        _src_Cache = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_fn_memoize;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_fn_memoize != null ? _src_fn_memoize : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fn_clearMemoized = exports.fn_memoize = void 0;
const Cache_1 = _src_Cache;
function fn_memoize(fn, opts = {}, key) {
    let _cache = new Cache_1.Cache(opts);
    if (_cache.isAsync) {
        return fn_memoizeAsync(_cache, fn, opts, key);
    }
    let _perInstance = opts?.perInstance ?? false;
    let _clearOnReady = opts?.clearOnReady ?? false;
    let _clearOnReject = opts?.clearOnReject ?? false;
    let _clearOn = opts?.clearOn ?? null;
    let _caches = [];
    let _thisArg = opts?.thisArg;
    const Wrapper = function (...args) {
        let cache = _cache;
        if (_perInstance === true) {
            const prop = `__$mem_${key}`;
            cache = this[prop];
            if (cache == null) {
                cache = new Cache_1.Cache(opts);
                Object.defineProperty(this, prop, {
                    value: cache,
                    enumerable: false
                });
                _caches.push(cache);
            }
        }
        const thisArg = _thisArg ?? this;
        const id = opts?.key?.({ this: thisArg }, ...args) ?? cache.resolveKey(args, opts?.keyOptions);
        const cached = cache.get(id);
        if (cached != null) {
            return cached;
        }
        let isPromise = null;
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
            isPromise = isPromise ?? (val != null && typeof val === 'object' && typeof val.then === 'function');
            if (isPromise) {
                val = val.then(result => {
                    if (_clearOn(result)) {
                        cache.clear(id);
                    }
                    return result;
                });
            }
            else if (_clearOn(val)) {
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
}
exports.fn_memoize = fn_memoize;
;
function fn_memoizeAsync(_cache, fn, opts = {}, key) {
    let _perInstance = opts?.perInstance ?? false;
    let _clearOnReady = opts?.clearOnReady ?? false;
    let _clearOnReject = opts?.clearOnReject ?? false;
    let _clearOn = opts?.clearOn ?? null;
    let _caches = [];
    let _thisArg = opts?.thisArg;
    const Wrapper = async function (...args) {
        let cache = _cache;
        if (_perInstance === true) {
            let prop = `__$mem_${key}`;
            cache = this[prop];
            if (cache == null) {
                cache = new Cache_1.Cache(opts);
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
        let isPromise = null;
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
            isPromise = isPromise ?? (val != null && typeof val === 'object' && typeof val.then === 'function');
            if (isPromise) {
                val = val.then(result => {
                    if (_clearOn(result)) {
                        cache.clearAsync(id);
                    }
                    return result;
                });
            }
            else if (_clearOn(val)) {
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
function fn_clearMemoized(fn, ...args) {
    if (args.length === 0) {
        fn?.clearAll?.();
        return;
    }
    fn?.clearArgs?.(...args);
    return;
}
exports.fn_clearMemoized = fn_clearMemoized;
//# sourceMappingURL=memoize.js.map
//# sourceMappingURL=memoize.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_fn_memoize === module.exports) {
        // do nothing if
    } else if (__isObj(_src_fn_memoize) && __isObj(module.exports)) {
        Object.assign(_src_fn_memoize, module.exports);
    } else {
        _src_fn_memoize = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_memoize;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_deco_memoize != null ? _src_deco_memoize : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deco_memoize = void 0;
const memoize_1 = _src_fn_memoize;
function deco_memoize(opts) {
    return function (target, propertyKey, descriptor) {
        const viaProperty = descriptor == null;
        const isGetter = !viaProperty && typeof descriptor.get === 'function';
        const innerFn = viaProperty
            ? target[propertyKey]
            : (isGetter ? descriptor.get : descriptor.value);
        const fn = (0, memoize_1.fn_memoize)(innerFn, opts, propertyKey);
        if (viaProperty) {
            target[propertyKey] = fn;
            return;
        }
        if (isGetter) {
            descriptor.get = fn;
        }
        else {
            descriptor.value = fn;
        }
        return descriptor;
    };
}
exports.deco_memoize = deco_memoize;
//# sourceMappingURL=memoize.js.map
//# sourceMappingURL=memoize.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_deco_memoize === module.exports) {
        // do nothing if
    } else if (__isObj(_src_deco_memoize) && __isObj(module.exports)) {
        Object.assign(_src_deco_memoize, module.exports);
    } else {
        _src_deco_memoize = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_debounce;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_deco_debounce != null ? _src_deco_debounce : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deco_debounce = void 0;
const requestFn = typeof requestAnimationFrame === 'undefined' ? setImmediate : requestAnimationFrame;
const clearRequest = typeof requestAnimationFrame === 'undefined' ? clearImmediate : cancelAnimationFrame;
/**
 *
 * @param timeoutMs ms to wait before calling inner fn
 */
function deco_debounce(timeoutMs) {
    return function (target, propertyKey, descriptor) {
        let viaProperty = descriptor == null;
        if (viaProperty) {
            descriptor = {
                configurable: true,
                value: target[propertyKey]
            };
        }
        let fn = descriptor.value;
        if (timeoutMs == null || timeoutMs === 0) {
            let frame = 0;
            descriptor.value = function (...args) {
                const self = this;
                if (frame !== 0) {
                    clearRequest(frame);
                }
                frame = requestFn(function () {
                    frame = 0;
                    fn.apply(self, args);
                });
            };
        }
        else {
            let timer = 0;
            descriptor.value = function (...args) {
                const self = this;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(self, args);
                }, timeoutMs);
            };
        }
        if (viaProperty) {
            target[propertyKey] = descriptor.value;
            return;
        }
        return descriptor;
    };
}
exports.deco_debounce = deco_debounce;
;
//# sourceMappingURL=debounce.js.map
//# sourceMappingURL=debounce.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_deco_debounce === module.exports) {
        // do nothing if
    } else if (__isObj(_src_deco_debounce) && __isObj(module.exports)) {
        Object.assign(_src_deco_debounce, module.exports);
    } else {
        _src_deco_debounce = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_model_Deferred;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_model_Deferred != null ? _src_model_Deferred : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = void 0;
class Deferred {
    isResolved = false;
    isRejected = false;
    resolvedArg;
    rejectedArg;
    resolveFn;
    rejectFn;
    promise = new Promise((resolve, reject) => {
        this.resolveFn = resolve;
        this.rejectFn = reject;
        if (this.isResolved === true) {
            resolve(this.resolvedArg);
        }
        if (this.isRejected === true) {
            reject(this.rejectedArg);
        }
    });
    resolve(arg) {
        if (this.resolveFn) {
            this.resolveFn(arg);
            return;
        }
        this.isResolved = true;
        this.resolvedArg = arg;
    }
    reject(arg) {
        if (this.rejectFn) {
            this.rejectFn(arg);
            return;
        }
        this.isRejected = true;
        this.rejectedArg = arg;
    }
    then(fnA, fnB) {
        this.promise.then(fnA, fnB);
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=Deferred.js.map
//# sourceMappingURL=Deferred.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_model_Deferred === module.exports) {
        // do nothing if
    } else if (__isObj(_src_model_Deferred) && __isObj(module.exports)) {
        Object.assign(_src_model_Deferred, module.exports);
    } else {
        _src_model_Deferred = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_throttle;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_deco_throttle != null ? _src_deco_throttle : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deco_throttle = void 0;
const Args_1 = _src_fn_Args;
const Deferred_1 = _src_model_Deferred;
function deco_throttle(timeWindow, mix) {
    let options = typeof mix === 'boolean'
        ? { shouldCallLater: mix }
        : mix;
    let shouldCallLater = options?.shouldCallLater ?? false;
    let perArguments = options?.perArguments ?? false;
    let perArgumentInfos = perArguments ? Object.create(null) : null;
    return function (target, propertyKey, descriptor) {
        let viaProperty = descriptor == null;
        let fn = viaProperty ? target[propertyKey] : descriptor.value;
        let timer = 0;
        let latestArgs = null;
        let latestCall = 0;
        let promise = null;
        let resultFn = function (...args) {
            let _key = perArguments !== true ? null : Args_1.Args.getKey(args);
            let _meta = perArguments !== true ? null : (perArgumentInfos[_key] ?? (perArgumentInfos[_key] = {
                latestCall: 0,
                latestArgs: null,
                promise: null,
                timer: 0
            }));
            let _latestCall = perArguments ? _meta.latestCall : latestCall;
            let _timer = perArguments ? _meta.timer : timer;
            let self = this;
            let now = Date.now();
            let diff = now - _latestCall;
            if (diff >= timeWindow) {
                latestCall = now;
                if (perArguments) {
                    _meta.latestCall = now;
                }
                if (shouldCallLater !== true) {
                    return fn.apply(self, args);
                }
            }
            latestArgs = args;
            if (perArguments) {
                _meta.latestArgs = args;
            }
            let _promise = perArguments ? _meta.promise : promise;
            if (_timer === 0) {
                _promise = promise = new Deferred_1.Deferred();
                if (perArguments) {
                    _meta.promise = _promise;
                }
                _timer = setTimeout(function () {
                    latestCall = Date.now();
                    timer = 0;
                    if (perArguments) {
                        _meta.latestCall = latestCall;
                        _meta.timer = 0;
                    }
                    let args = perArguments ? _meta.latestArgs : latestArgs;
                    let r = fn.apply(self, args);
                    promise.resolve(r);
                }, diff >= timeWindow ? timeWindow : timeWindow - diff);
                timer = _timer;
                if (perArguments) {
                    _meta.timer = _timer;
                }
            }
            return _promise;
        };
        if (viaProperty) {
            target[propertyKey] = resultFn;
            return;
        }
        descriptor.value = resultFn;
        return descriptor;
    };
}
exports.deco_throttle = deco_throttle;
//# sourceMappingURL=throttle.js.map
//# sourceMappingURL=throttle.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_deco_throttle === module.exports) {
        // do nothing if
    } else if (__isObj(_src_deco_throttle) && __isObj(module.exports)) {
        Object.assign(_src_deco_throttle, module.exports);
    } else {
        _src_deco_throttle = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_fn_queued;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_fn_queued != null ? _src_fn_queued : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fn_queued = void 0;
const Deferred_1 = _src_model_Deferred;
/** For original async method - ensure it is called one after another  */
function fn_queued(fn, opts = {}) {
    let queue = [];
    let busy = false;
    let lastResultAt = 0;
    let throttle = opts?.throttle;
    let resultFn = function (...args) {
        if (opts != null && opts.single === true && queue.length > 0) {
            return queue[0].promise;
        }
        let wrapped = Queued.prepair(fn, this, args, opts);
        if (opts != null && opts.trimQueue && queue.length > 0) {
            queue.splice(0);
        }
        queue.push(wrapped);
        if (busy === false) {
            busy = true;
            tick();
        }
        return wrapped.promise;
    };
    let tick = function () {
        if (queue.length === 0) {
            busy = false;
            return;
        }
        if (throttle != null) {
            let ms = throttle - (Date.now() - lastResultAt);
            if (ms > 0) {
                setTimeout(tick, ms);
                return;
            }
        }
        let x = queue.shift();
        x.always(next);
        x.run();
    };
    let next = function () {
        lastResultAt = Date.now();
        tick();
    };
    return resultFn;
}
exports.fn_queued = fn_queued;
const Queued = {
    prepair(innerFn, ctx, args, opts) {
        let dfr = new Deferred_1.Deferred;
        let completed = false;
        let timeout = null;
        return {
            promise: dfr,
            run() {
                let result = innerFn.apply(ctx, args);
                if ('then' in result === false) {
                    dfr.resolve(result);
                }
                else {
                    if (opts?.timeout > 0) {
                        timeout = setTimeout(() => {
                            if (completed) {
                                return;
                            }
                            dfr.reject(new Error(`Queue Worker: the inner function ${innerFn.name} timeouted: ${opts.timeout}`));
                        }, opts.timeout);
                    }
                    result.then(_result => {
                        if (timeout != null) {
                            clearTimeout(timeout);
                        }
                        if (completed) {
                            return;
                        }
                        completed = true;
                        dfr.resolve(_result);
                    }, _error => {
                        if (timeout != null) {
                            clearTimeout(timeout);
                        }
                        if (completed) {
                            return;
                        }
                        completed = true;
                        dfr.reject(_error);
                    });
                }
                return result;
            },
            always(fn) {
                dfr.then(fn, fn);
            }
        };
    }
};
//# sourceMappingURL=queued.js.map
//# sourceMappingURL=queued.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_fn_queued === module.exports) {
        // do nothing if
    } else if (__isObj(_src_fn_queued) && __isObj(module.exports)) {
        Object.assign(_src_fn_queued, module.exports);
    } else {
        _src_fn_queued = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_queued;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_deco_queued != null ? _src_deco_queued : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deco_queued = void 0;
const queued_1 = _src_fn_queued;
function deco_queued(opts = null) {
    return function (target, propertyKey, descriptor) {
        let viaProperty = descriptor == null;
        let fn = viaProperty ? target[propertyKey] : descriptor.value;
        let resultFn = (0, queued_1.fn_queued)(fn, opts);
        if (viaProperty) {
            target[propertyKey] = resultFn;
            return;
        }
        descriptor.value = resultFn;
        return descriptor;
    };
}
exports.deco_queued = deco_queued;
//# sourceMappingURL=queued.js.map
//# sourceMappingURL=queued.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_deco_queued === module.exports) {
        // do nothing if
    } else if (__isObj(_src_deco_queued) && __isObj(module.exports)) {
        Object.assign(_src_deco_queued, module.exports);
    } else {
        _src_deco_queued = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_utils_requireLib;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_utils_requireLib != null ? _src_utils_requireLib : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLib = void 0;
var requireLib;
(function (requireLib) {
    async function load(name) {
        //#if (CJS)
        const r = require;
        return Promise.resolve(r(name));
        //#endif
    }
    requireLib.load = load;
})(requireLib = exports.requireLib || (exports.requireLib = {}));
//# sourceMappingURL=requireLib.js.map
//# sourceMappingURL=requireLib.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_utils_requireLib === module.exports) {
        // do nothing if
    } else if (__isObj(_src_utils_requireLib) && __isObj(module.exports)) {
        Object.assign(_src_utils_requireLib, module.exports);
    } else {
        _src_utils_requireLib = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_FsTransport;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_persistance_FsTransport != null ? _src_persistance_FsTransport : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsTransport = void 0;
const requireLib_1 = _src_utils_requireLib;
class FsTransport {
    opts;
    _file = null;
    isAsync = true;
    constructor(opts) {
        this.opts = opts;
    }
    async restoreAsync() {
        let file = await this.getFileSafeCtor();
        if (file == null) {
            return;
        }
        try {
            let json = await file.readAsync();
            return typeof json === 'string'
                ? JSON.parse(json)
                : json;
        }
        catch (error) {
            return {};
        }
    }
    async flushAsync(coll) {
        let file = await this.getFileSafeCtor();
        if (file == null) {
            return;
        }
        let json = JSON.stringify(coll);
        return await file.writeAsync(json);
    }
    async getFileSafeCtor() {
        let isBrowser = typeof process === 'undefined' || typeof process.exit !== 'function';
        if (isBrowser) {
            let useLocalStorage = this.opts?.browser?.localStorage;
            if (useLocalStorage) {
                this._file = new LocalStorageFile(this.opts.path);
            }
            return null;
        }
        const { path } = this.opts;
        if (path in CACHED_STORAGES) {
            this._file = CACHED_STORAGES[path];
        }
        else {
            /** lazy load require and preventing bundler's build */
            const module = await requireLib_1.requireLib.load('atma-io');
            const FileSafeCtor = module.FileSafe;
            this._file = new FileSafeCtor(this.opts.path, { threadSafe: true });
            CACHED_STORAGES[path] = this._file;
        }
        return this._file;
    }
}
exports.FsTransport = FsTransport;
class LocalStorageFile {
    path;
    key = `memd:fs:${this.path}`;
    constructor(path) {
        this.path = path;
    }
    async readAsync() {
        return localStorage.getItem(this.key);
    }
    async writeAsync(content) {
        localStorage.setItem(this.key, content);
    }
}
const CACHED_STORAGES = {};
//# sourceMappingURL=FsTransport.js.map
//# sourceMappingURL=FsTransport.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_persistance_FsTransport === module.exports) {
        // do nothing if
    } else if (__isObj(_src_persistance_FsTransport) && __isObj(module.exports)) {
        Object.assign(_src_persistance_FsTransport, module.exports);
    } else {
        _src_persistance_FsTransport = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_LocalStorageTransport;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_persistance_LocalStorageTransport != null ? _src_persistance_LocalStorageTransport : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageTransport = void 0;
class LocalStorageTransport {
    opts;
    isAsync = false;
    constructor(opts) {
        this.opts = opts;
        if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') {
            throw new Error('Browser expected');
        }
    }
    restore() {
        try {
            return JSON.parse(localStorage.getItem(this.opts.key));
        }
        catch (error) {
        }
    }
    flush(coll) {
        try {
            localStorage.getItem(JSON.stringify(this.opts.key));
        }
        catch (error) {
        }
    }
}
exports.LocalStorageTransport = LocalStorageTransport;
//# sourceMappingURL=LocalStorageTransport.js.map
//# sourceMappingURL=LocalStorageTransport.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_persistance_LocalStorageTransport === module.exports) {
        // do nothing if
    } else if (__isObj(_src_persistance_LocalStorageTransport) && __isObj(module.exports)) {
        Object.assign(_src_persistance_LocalStorageTransport, module.exports);
    } else {
        _src_persistance_LocalStorageTransport = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_workers_CachedWorker;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
    var exports = _src_workers_CachedWorker != null ? _src_workers_CachedWorker : {};
    var module = { exports: exports };

    "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedWorker = void 0;
const FsTransport_1 = _src_persistance_FsTransport;
const LocalStorageTransport_1 = _src_persistance_LocalStorageTransport;
const Cache_1 = _src_Cache;
class CachedWorker {
    opts;
    cache;
    worker;
    workerDfr;
    constructor(opts) {
        this.opts = opts;
        const persistance = opts.persistance ?? this.getTransport();
        if (persistance) {
            persistance.debounceMs = 0;
        }
        this.cache = new Cache_1.Cache({
            persistance,
            maxAge: opts.maxAge,
            monitors: opts.monitors,
        });
        this.worker = opts.worker;
    }
    getTransport() {
        let t = this.opts.transport;
        if (t == null) {
            return null;
        }
        if ('path' in t) {
            return new FsTransport_1.FsTransport(t);
        }
        if ('key' in t) {
            return new LocalStorageTransport_1.LocalStorageTransport(t);
        }
        throw new Error('Invalid transport options');
    }
    run() {
        let result = this.cache.get('result');
        if (result != null) {
            return result;
        }
        result = this.worker();
        this.cache.set('result', result);
        return result;
    }
    async runAsync() {
        return this.workerDfr ?? (this.workerDfr = (async () => {
            let result = await this.cache.getAsync('result');
            if (result) {
                return result;
            }
            result = await this.opts.worker();
            await this.cache.setAsync('result', result);
            return result;
        })());
    }
    static run(opts) {
        return new CachedWorker(opts).run();
    }
    static runAsync(opts) {
        return new CachedWorker(opts).runAsync();
    }
}
exports.CachedWorker = CachedWorker;
//# sourceMappingURL=CachedWorker.js.map
//# sourceMappingURL=CachedWorker.ts.map;

    function __isObj(x) {
        return x != null && typeof x === 'object' && x.constructor === Object;
    }
    if (_src_workers_CachedWorker === module.exports) {
        // do nothing if
    } else if (__isObj(_src_workers_CachedWorker) && __isObj(module.exports)) {
        Object.assign(_src_workers_CachedWorker, module.exports);
    } else {
        _src_workers_CachedWorker = module.exports;
    }

    ;
}());

// end:source ./ModuleSimplified.js

"use strict";
const memoize_1 = _src_deco_memoize;
const debounce_1 = _src_deco_debounce;
const throttle_1 = _src_deco_throttle;
const queued_1 = _src_deco_queued;
const memoize_2 = _src_fn_memoize;
const Cache_1 = _src_Cache;
const FsTransport_1 = _src_persistance_FsTransport;
const LocalStorageTransport_1 = _src_persistance_LocalStorageTransport;
const CachedWorker_1 = _src_workers_CachedWorker;
const queued_2 = _src_fn_queued;
class Memd {
    static Cache = Cache_1.Cache;
    static fn = {
        memoize: memoize_2.fn_memoize,
        queued: queued_2.fn_queued,
        clearMemoized: memoize_2.fn_clearMemoized
    };
    static deco = {
        memoize: memoize_1.deco_memoize,
        throttle: throttle_1.deco_throttle,
        debounce: debounce_1.deco_debounce,
        queued: queued_1.deco_queued
    };
    static FsTransport = FsTransport_1.FsTransport;
    static LocalStorageTransport = LocalStorageTransport_1.LocalStorageTransport;
    static CachedWorker = CachedWorker_1.CachedWorker;
    static default;
}
Memd.default = Memd;
module.exports = Memd;
//# sourceMappingURL=export.js.map
//# sourceMappingURL=export.ts.map

}));

// end:source ./UMD.js
