
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
var _src_workers_CachedWorker = {};

// source ./ModuleSimplified.js
var _src_fn_Args;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Args;
(function (Args) {
    function getKey(args) {
        var key = '';
        for (var i = 0; i < args.length; i++) {
            if (i > 0) {
                key += '.';
            }
            key += getKeySingle(args[i]);
        }
        return key;
    }
    Args.getKey = getKey;
    function getKeySingle(misc) {
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
            return getKey(misc);
        }
        var str = '';
        for (var key in misc) {
            str += '.' + getKeySingle(misc[key]);
        }
        return str;
    }
})(Args = exports.Args || (exports.Args = {}));
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_fn_Args) && isObject(module.exports)) {
		Object.assign(_src_fn_Args, module.exports);
		return;
	}
	_src_fn_Args = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_TransportWorker;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TransportWorker = /** @class */ (function () {
    function TransportWorker(cache, transport) {
        var _this = this;
        var _a;
        this.cache = cache;
        this.transport = transport;
        this.isReady = false;
        this.isAsync = false;
        this.lastModified = null;
        this.restorePromise = null;
        this.coll = {};
        this.isAsync = Boolean(this.transport.isAsync);
        this.flushRunner = new AsyncRunner(function () { return _this.flushInner(); }, (_a = this.transport.debounceMs, (_a !== null && _a !== void 0 ? _a : 500)));
    }
    TransportWorker.prototype.restore = function () {
        if (this.isReady) {
            return;
        }
        if (this.isAsync) {
            throw new Error('Transport is Async');
        }
        var coll = this.transport.restore();
        this.cache.setCollection(coll);
        this.isReady = true;
    };
    TransportWorker.prototype.restoreAsync = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.restorePromise, (_a !== null && _a !== void 0 ? _a : (this.restorePromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var coll;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.isReady) {
                                        return [2 /*return*/];
                                    }
                                    if (this.isAsync === false) {
                                        this.restore();
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, this.transport.restoreAsync()];
                                case 1:
                                    coll = _a.sent();
                                    if (this.isReady) {
                                        return [2 /*return*/];
                                    }
                                    this.cache.setCollection(coll);
                                    this.isReady = true;
                                    return [2 /*return*/];
                            }
                        });
                    }); })())))];
            });
        });
    };
    TransportWorker.prototype.flush = function (key, entry) {
        this.isReady = true;
        this.lastModified = new Date();
        this.coll[key] = entry;
        if (this.transport.debounceMs === 0) {
            this.transport.flush(this.coll);
            return;
        }
        this.flushRunner.run();
    };
    TransportWorker.prototype.flushAsync = function (key, entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.isReady === false)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.restoreAsync()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.lastModified = new Date();
                        this.coll[key] = entry;
                        return [2 /*return*/, this.flushRunner.run()];
                }
            });
        });
    };
    TransportWorker.prototype.flushAsyncAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.flushRunner.run()];
            });
        });
    };
    TransportWorker.prototype.clear = function (key) {
        if (key != null) {
            delete this.coll[key];
        }
        else {
            this.coll = {};
        }
        return this.flushRunner.run();
    };
    TransportWorker.prototype.clearAsync = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clear(key)];
            });
        });
    };
    TransportWorker.prototype.flushInner = function () {
        if (this.transport.isAsync) {
            return this.transport.flushAsync(this.coll);
        }
        this.transport.flush(this.coll);
    };
    return TransportWorker;
}());
exports.TransportWorker = TransportWorker;
var AsyncRunner = /** @class */ (function () {
    function AsyncRunner(fn, debounce) {
        this.fn = fn;
        this.debounce = debounce;
        this.isWaiting = false;
        this.isBusy = false;
        this.timeout = null;
        this.shouldRunNext = false;
    }
    AsyncRunner.prototype.run = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                if (this.isWaiting && !this.isBusy) {
                    this.defer();
                    return [2 /*return*/, this.dfr.promise];
                }
                if (this.isBusy) {
                    this.shouldRunNext = true;
                    return [2 /*return*/, this.dfr.promise];
                }
                this.isWaiting = true;
                this.isBusy = false;
                this.dfr = new Deferred;
                this.defer();
                return [2 /*return*/, this.dfr.promise];
            });
        });
    };
    AsyncRunner.prototype.defer = function () {
        var _this = this;
        if (this.isWaiting) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function () { return _this.runInner(); }, this.debounce);
    };
    AsyncRunner.prototype.reset = function () {
        clearTimeout(this.timeout);
        this.isWaiting = false;
        this.isBusy = false;
        this.shouldRunNext = false;
    };
    AsyncRunner.prototype.runInner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, runNext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isWaiting = false;
                        this.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fn()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Transport error', error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        runNext = this.shouldRunNext;
                        this.dfr.resolve(null);
                        this.reset();
                        if (runNext) {
                            this.run();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return AsyncRunner;
}());
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    return Deferred;
}());
function wait(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_persistance_TransportWorker) && isObject(module.exports)) {
		Object.assign(_src_persistance_TransportWorker, module.exports);
		return;
	}
	_src_persistance_TransportWorker = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_StoreWorker;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var StoreWorker = /** @class */ (function () {
    function StoreWorker(store, options) {
        if (options === void 0) { options = {}; }
        var _a;
        this.store = store;
        this.options = options;
        this.isAsync = false;
        this.doNotWaitSave = false;
        this.isAsync = this.store.getAsync != null;
        this.doNotWaitSave = ((_a = options) === null || _a === void 0 ? void 0 : _a.doNotWaitSave) === true;
    }
    StoreWorker.prototype.get = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.store.get(key);
    };
    StoreWorker.prototype.getAsync = function (key) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this.store).getAsync.apply(_a, __spreadArrays([key], args));
    };
    StoreWorker.prototype.save = function (key, val) {
        this.store.save(key, val);
    };
    StoreWorker.prototype.saveAsync = function (key, val) {
        var promise = this.store.saveAsync(key, val);
        if (this.doNotWaitSave === true) {
            return null;
        }
        return promise;
    };
    StoreWorker.prototype.clear = function (key) {
        this.store.clear(key);
    };
    StoreWorker.prototype.clearAsync = function (key) {
        return this.store.clearAsync(key);
    };
    return StoreWorker;
}());
exports.StoreWorker = StoreWorker;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_persistance_StoreWorker) && isObject(module.exports)) {
		Object.assign(_src_persistance_StoreWorker, module.exports);
		return;
	}
	_src_persistance_StoreWorker = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_Cache;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Args_1 = _src_fn_Args;
var TransportWorker_1 = _src_persistance_TransportWorker;
var StoreWorker_1 = _src_persistance_StoreWorker;
var Cache = /** @class */ (function () {
    function Cache(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.options = options;
        this._cache = {};
        this.isAsync = false;
        if (this.options.monitors) {
            this.onChanged = this.onChanged.bind(this);
            options.monitors.forEach(function (x) { return x.on('change', _this.onChanged); });
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
    Cache.prototype.resolveKey = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a, _b, _c;
        var key = (_c = (_a = this.options) === null || _a === void 0 ? void 0 : (_b = _a).keyResolver) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArrays([_b], args));
        return (key !== null && key !== void 0 ? key : Args_1.Args.getKey(args));
    };
    Cache.prototype.get = function (key) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._transport != null && this._transport.isReady === false) {
            this._transport.restore();
        }
        var entry = this._cache[key];
        if (entry == null) {
            if (this._store == null) {
                return null;
            }
            entry = (_a = this._store).get.apply(_a, __spreadArrays([key], args));
            if (entry == null) {
                return null;
            }
        }
        if (this.options.maxAge != null && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge) {
            this.clear(key);
            return null;
        }
        return entry.value;
    };
    Cache.prototype.getAsync = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, Promise, function () {
            var entry;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._transport != null && this._transport.isReady === false)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._transport.restoreAsync()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        entry = this._cache[key];
                        if (!(entry == null)) return [3 /*break*/, 4];
                        if (this._store == null) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (_a = this._store).getAsync.apply(_a, __spreadArrays([key], args))];
                    case 3:
                        entry = _b.sent();
                        if (entry == null) {
                            return [2 /*return*/, null];
                        }
                        _b.label = 4;
                    case 4:
                        if (!(this.options.maxAge != null && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.clearAsync(key)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/, entry.value];
                }
            });
        });
    };
    Cache.prototype.set = function (key, val) {
        var cached = {
            timestamp: Date.now(),
            value: val
        };
        this._cache[key] = cached;
        this.persist(key, cached, false);
        return val;
    };
    Cache.prototype.persist = function (key, entry, isAsync) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var transport, store, val, isPromise;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        transport = this._transport;
                        store = this._store;
                        if (transport == null && store == null) {
                            return [2 /*return*/];
                        }
                        val = entry.value;
                        isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
                        if (!isPromise) return [3 /*break*/, 2];
                        return [4 /*yield*/, val];
                    case 1:
                        val = _e.sent();
                        entry = {
                            value: val,
                            timestamp: entry.timestamp,
                        };
                        _e.label = 2;
                    case 2:
                        if (!isAsync) return [3 /*break*/, 5];
                        return [4 /*yield*/, ((_a = this._transport) === null || _a === void 0 ? void 0 : _a.flushAsync(key, entry))];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, ((_b = this._store) === null || _b === void 0 ? void 0 : _b.saveAsync(key, entry))];
                    case 4:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        (_c = this._transport) === null || _c === void 0 ? void 0 : _c.flush(key, entry);
                        (_d = this._store) === null || _d === void 0 ? void 0 : _d.save(key, entry);
                        _e.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Cache.prototype.setAsync = function (key, val) {
        return __awaiter(this, void 0, Promise, function () {
            var cached;
            return __generator(this, function (_a) {
                cached = {
                    timestamp: Date.now(),
                    value: val
                };
                this._cache[key] = cached;
                this.persist(key, cached, true);
                return [2 /*return*/, val];
            });
        });
    };
    Cache.prototype.setCollection = function (coll) {
        this._cache = (coll !== null && coll !== void 0 ? coll : {});
    };
    Cache.prototype.clear = function (key) {
        var _a, _b;
        if (typeof key === 'string') {
            this._cache[key] = null;
        }
        else {
            this._cache = {};
        }
        (_a = this._transport) === null || _a === void 0 ? void 0 : _a.clear(key);
        (_b = this._store) === null || _b === void 0 ? void 0 : _b.clear(key);
    };
    Cache.prototype.clearAsync = function (key) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (typeof key === 'string') {
                            this._cache[key] = null;
                        }
                        else {
                            this._cache = {};
                        }
                        return [4 /*yield*/, ((_a = this._transport) === null || _a === void 0 ? void 0 : _a.clearAsync(key))];
                    case 1:
                        _c.sent();
                        (_b = this._store) === null || _b === void 0 ? void 0 : _b.clearAsync(key);
                        return [2 /*return*/];
                }
            });
        });
    };
    Cache.prototype.destroy = function () {
        var _this = this;
        var _a;
        this.clear();
        (_a = this.options.monitors) === null || _a === void 0 ? void 0 : _a.forEach(function (x) { return x.off('change', _this.onChanged); });
    };
    Cache.prototype.onChanged = function (key) {
        this.clear(key);
    };
    Cache.prototype.flushAsync = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this._transport) === null || _a === void 0 ? void 0 : _a.flushAsyncAll())];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Cache;
}());
exports.Cache = Cache;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_Cache) && isObject(module.exports)) {
		Object.assign(_src_Cache, module.exports);
		return;
	}
	_src_Cache = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_fn_memoize;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Cache_1 = _src_Cache;
function fn_memoize(fn, opts, key) {
    if (opts === void 0) { opts = {}; }
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var _cache = new Cache_1.Cache(opts);
    if (_cache.isAsync) {
        return fn_memoizeAsync(_cache, fn, opts, key);
    }
    var _perInstance = (_b = (_a = opts) === null || _a === void 0 ? void 0 : _a.perInstance, (_b !== null && _b !== void 0 ? _b : false));
    var _clearOnReady = (_d = (_c = opts) === null || _c === void 0 ? void 0 : _c.clearOnReady, (_d !== null && _d !== void 0 ? _d : false));
    var _clearOnReject = (_f = (_e = opts) === null || _e === void 0 ? void 0 : _e.clearOnReject, (_f !== null && _f !== void 0 ? _f : false));
    var _clearOn = (_h = (_g = opts) === null || _g === void 0 ? void 0 : _g.clearOn, (_h !== null && _h !== void 0 ? _h : null));
    var _caches = [];
    var Wrapper = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var cache = _cache;
        if (_perInstance === true) {
            var prop = "__$mem_" + key;
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
        var id = cache.resolveKey.apply(cache, args);
        var cached = cache.get(id);
        if (cached != null) {
            return cached;
        }
        var isPromise = null;
        var val = fn.apply(this, args);
        if (_clearOnReject === true) {
            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
            if (isPromise) {
                val = val.then(null, function (err) {
                    cache.clear(id);
                    return Promise.reject(err);
                });
            }
        }
        if (_clearOnReady === true) {
            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
            if (isPromise) {
                val = val.then(function (result) {
                    cache.clear(id);
                    return Promise.resolve(result);
                }, function (err) {
                    cache.clear(id);
                    return Promise.reject(err);
                });
            }
        }
        if (_clearOn != null) {
            isPromise = (isPromise !== null && isPromise !== void 0 ? isPromise : (val != null && typeof val === 'object' && typeof val.then === 'function'));
            if (isPromise) {
                val = val.then(function (result) {
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
    Wrapper.clearArgs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var id = _cache.resolveKey.apply(_cache, args);
        _cache.clear(id);
        _caches.forEach(function (x) { return x.clear(id); });
    };
    Wrapper.clearAll = function () {
        _cache.clear();
        _caches.forEach(function (x) { return x.clear(); });
    };
    return Wrapper;
}
exports.fn_memoize = fn_memoize;
;
function fn_memoizeAsync(_cache, fn, opts, key) {
    if (opts === void 0) { opts = {}; }
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var _perInstance = (_b = (_a = opts) === null || _a === void 0 ? void 0 : _a.perInstance, (_b !== null && _b !== void 0 ? _b : false));
    var _clearOnReady = (_d = (_c = opts) === null || _c === void 0 ? void 0 : _c.clearOnReady, (_d !== null && _d !== void 0 ? _d : false));
    var _clearOnReject = (_f = (_e = opts) === null || _e === void 0 ? void 0 : _e.clearOnReject, (_f !== null && _f !== void 0 ? _f : false));
    var _clearOn = (_h = (_g = opts) === null || _g === void 0 ? void 0 : _g.clearOn, (_h !== null && _h !== void 0 ? _h : null));
    var _caches = [];
    var Wrapper = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var cache, prop, id, cached, isPromise, val;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = _cache;
                        if (_perInstance === true) {
                            prop = "__$mem_" + key;
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
                        id = cache.resolveKey.apply(cache, args);
                        return [4 /*yield*/, cache.getAsync.apply(cache, __spreadArrays([id], args))];
                    case 1:
                        cached = _a.sent();
                        if (cached != null) {
                            return [2 /*return*/, cached];
                        }
                        isPromise = null;
                        val = fn.apply(this, args);
                        if (_clearOnReject === true) {
                            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
                            if (isPromise) {
                                val = val.then(null, function (err) {
                                    cache.clearAsync(id);
                                    return Promise.reject(err);
                                });
                            }
                        }
                        if (_clearOnReady === true) {
                            isPromise = val != null && typeof val === 'object' && typeof val.then === 'function';
                            if (isPromise) {
                                val = val.then(function (result) {
                                    cache.clearAsync(id);
                                    return Promise.resolve(result);
                                }, function (err) {
                                    cache.clearAsync(id);
                                    return Promise.reject(err);
                                });
                            }
                        }
                        if (_clearOn != null) {
                            isPromise = (isPromise !== null && isPromise !== void 0 ? isPromise : (val != null && typeof val === 'object' && typeof val.then === 'function'));
                            if (isPromise) {
                                val = val.then(function (result) {
                                    if (_clearOn(result)) {
                                        cache.clearAsync(id);
                                    }
                                    return result;
                                });
                            }
                            else if (_clearOn(val)) {
                                // don't even set to cache
                                return [2 /*return*/, val];
                            }
                        }
                        return [2 /*return*/, cache.setAsync(id, val)];
                }
            });
        });
    };
    Wrapper.clearArgs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var id = _cache.resolveKey.apply(_cache, args);
        _cache.clearAsync(id);
        _caches.forEach(function (x) { return x.clearAsync(id); });
    };
    Wrapper.clearAll = function () {
        _cache.clearAsync();
        _caches.forEach(function (x) { return x.clearAsync(); });
    };
    return Wrapper;
}
function fn_clearMemoized(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var _a, _b, _c, _d, _e, _f;
    if (args.length === 0) {
        (_c = (_a = fn) === null || _a === void 0 ? void 0 : (_b = _a).clearAll) === null || _c === void 0 ? void 0 : _c.call(_b);
        return;
    }
    (_f = (_d = fn) === null || _d === void 0 ? void 0 : (_e = _d).clearArgs) === null || _f === void 0 ? void 0 : _f.call.apply(_f, __spreadArrays([_e], args));
    return;
}
exports.fn_clearMemoized = fn_clearMemoized;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_fn_memoize) && isObject(module.exports)) {
		Object.assign(_src_fn_memoize, module.exports);
		return;
	}
	_src_fn_memoize = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_memoize;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memoize_1 = _src_fn_memoize;
function deco_memoize(opts) {
    return function (target, propertyKey, descriptor) {
        var viaProperty = descriptor == null;
        var fn = memoize_1.fn_memoize(viaProperty ? target[propertyKey] : descriptor.value, opts, propertyKey);
        if (viaProperty) {
            target[propertyKey] = fn;
            return;
        }
        descriptor.value = fn;
        return descriptor;
    };
}
exports.deco_memoize = deco_memoize;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_deco_memoize) && isObject(module.exports)) {
		Object.assign(_src_deco_memoize, module.exports);
		return;
	}
	_src_deco_memoize = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_debounce;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requestFn = typeof requestAnimationFrame === 'undefined' ? setImmediate : requestAnimationFrame;
var clearRequest = typeof requestAnimationFrame === 'undefined' ? clearImmediate : cancelAnimationFrame;
/**
 *
 * @param timeoutMs ms to wait before calling inner fn
 */
function deco_debounce(timeoutMs) {
    return function (target, propertyKey, descriptor) {
        var viaProperty = descriptor == null;
        if (viaProperty) {
            descriptor = {
                configurable: true,
                value: target[propertyKey]
            };
        }
        var fn = descriptor.value;
        if (timeoutMs == null || timeoutMs === 0) {
            var frame_1 = 0;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var self = this;
                if (frame_1 !== 0) {
                    clearRequest(frame_1);
                }
                frame_1 = requestFn(function () {
                    frame_1 = 0;
                    fn.apply(self, args);
                });
            };
        }
        else {
            var timer_1 = 0;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var self = this;
                clearTimeout(timer_1);
                timer_1 = setTimeout(function () {
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
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_deco_debounce) && isObject(module.exports)) {
		Object.assign(_src_deco_debounce, module.exports);
		return;
	}
	_src_deco_debounce = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_throttle;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Calls function maximal each time window frame
 * @param timeWindow how often, in ms, should the function be called
 * @param shouldCallLater start calling fn on frame start
 */
function deco_throttle(timeWindow, shouldCallLater) {
    return function (target, propertyKey, descriptor) {
        var viaProperty = descriptor == null;
        var fn = viaProperty ? target[propertyKey] : descriptor.value;
        var timer = 0;
        var latestArgs = null;
        var latestCall = 0;
        var resultFn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var self = this;
            var now = Date.now();
            var diff = now - latestCall;
            if (diff >= timeWindow) {
                latestCall = now;
                if (shouldCallLater !== true) {
                    fn.apply(self, args);
                    return;
                }
            }
            latestArgs = args;
            if (timer === 0) {
                timer = setTimeout(function () {
                    latestCall = Date.now();
                    timer = 0;
                    fn.apply(self, latestArgs);
                }, diff >= timeWindow ? timeWindow : timeWindow - diff);
            }
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
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_deco_throttle) && isObject(module.exports)) {
		Object.assign(_src_deco_throttle, module.exports);
		return;
	}
	_src_deco_throttle = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_model_Deferred;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.isResolved = false;
        this.isRejected = false;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolveFn = resolve;
            _this.rejectFn = reject;
            if (_this.isResolved === true) {
                resolve(_this.resolvedArg);
            }
            if (_this.isRejected === true) {
                reject(_this.rejectedArg);
            }
        });
    }
    Deferred.prototype.resolve = function (arg) {
        if (this.resolveFn) {
            this.resolveFn(arg);
            return;
        }
        this.isResolved = true;
        this.resolvedArg = arg;
    };
    Deferred.prototype.reject = function (arg) {
        if (this.rejectFn) {
            this.rejectFn(arg);
            return;
        }
        this.isRejected = true;
        this.rejectedArg = arg;
    };
    Deferred.prototype.then = function (fnA, fnB) {
        this.promise.then(fnA, fnB);
    };
    return Deferred;
}());
exports.Deferred = Deferred;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_model_Deferred) && isObject(module.exports)) {
		Object.assign(_src_model_Deferred, module.exports);
		return;
	}
	_src_model_Deferred = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_fn_queued;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Deferred_1 = _src_model_Deferred;
function fn_queued(fn, opts) {
    if (opts === void 0) { opts = {}; }
    var _a;
    var queue = [];
    var busy = false;
    var lastResultAt = 0;
    var throttle = (_a = opts) === null || _a === void 0 ? void 0 : _a.throttle;
    var resultFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (opts != null && opts.single === true && queue.length > 0) {
            return queue[0].promise;
        }
        var wrapped = Queued.prepair(fn, this, args, opts);
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
    var tick = function () {
        if (queue.length === 0) {
            busy = false;
            return;
        }
        if (throttle != null) {
            var ms = throttle - (Date.now() - lastResultAt);
            if (ms > 0) {
                setTimeout(tick, ms);
                return;
            }
        }
        var x = queue.shift();
        x.always(next);
        x.run();
    };
    var next = function () {
        lastResultAt = Date.now();
        tick();
    };
    return resultFn;
}
exports.fn_queued = fn_queued;
var Queued = {
    prepair: function (innerFn, ctx, args, opts) {
        var dfr = new Deferred_1.Deferred;
        var completed = false;
        var timeout = null;
        return {
            promise: dfr,
            run: function () {
                var _a;
                var result = innerFn.apply(ctx, args);
                if ('then' in result === false) {
                    dfr.resolve(result);
                }
                else {
                    if (((_a = opts) === null || _a === void 0 ? void 0 : _a.timeout) > 0) {
                        timeout = setTimeout(function () {
                            if (completed) {
                                return;
                            }
                            dfr.reject(new Error("Queue Worker: the inner function " + innerFn.name + " timeouted: " + opts.timeout));
                        }, opts.timeout);
                    }
                    result.then(function (_result) {
                        if (timeout != null) {
                            clearTimeout(timeout);
                        }
                        if (completed) {
                            return;
                        }
                        completed = true;
                        dfr.resolve(_result);
                    }, function (_error) {
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
            always: function (fn) {
                dfr.then(fn, fn);
            }
        };
    }
};
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_fn_queued) && isObject(module.exports)) {
		Object.assign(_src_fn_queued, module.exports);
		return;
	}
	_src_fn_queued = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_deco_queued;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queued_1 = _src_fn_queued;
function deco_queued(opts) {
    if (opts === void 0) { opts = null; }
    return function (target, propertyKey, descriptor) {
        var viaProperty = descriptor == null;
        var fn = viaProperty ? target[propertyKey] : descriptor.value;
        var resultFn = queued_1.fn_queued(fn, opts);
        if (viaProperty) {
            target[propertyKey] = resultFn;
            return;
        }
        descriptor.value = resultFn;
        return descriptor;
    };
}
exports.deco_queued = deco_queued;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_deco_queued) && isObject(module.exports)) {
		Object.assign(_src_deco_queued, module.exports);
		return;
	}
	_src_deco_queued = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_FsTransport;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FsTransport = /** @class */ (function () {
    function FsTransport(opts) {
        this.opts = opts;
        this._file = null;
        this.isAsync = true;
        if (typeof process === 'undefined' || typeof process.exit !== 'function') {
            throw new Error('NodeJS expected');
        }
        var r = require;
        var module = 'atma-io';
        var FileSafe = r(module).FileSafe;
        this._file = new FileSafe(this.opts.path, { threadSafe: true });
    }
    FsTransport.prototype.restoreAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var str, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._file.readAsync()];
                    case 1:
                        str = _a.sent();
                        return [2 /*return*/, JSON.parse(str)];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, {}];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FsTransport.prototype.flushAsync = function (coll) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = JSON.stringify(coll);
                        return [4 /*yield*/, this._file.writeAsync(json)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return FsTransport;
}());
exports.FsTransport = FsTransport;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_persistance_FsTransport) && isObject(module.exports)) {
		Object.assign(_src_persistance_FsTransport, module.exports);
		return;
	}
	_src_persistance_FsTransport = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_persistance_LocalStorageTransport;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorageTransport = /** @class */ (function () {
    function LocalStorageTransport(opts) {
        this.opts = opts;
        this.isAsync = false;
        if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') {
            throw new Error('Browser expected');
        }
    }
    LocalStorageTransport.prototype.restore = function () {
        try {
            return JSON.parse(localStorage.getItem(this.opts.key));
        }
        catch (error) {
        }
    };
    LocalStorageTransport.prototype.flush = function (coll) {
        try {
            localStorage.getItem(JSON.stringify(this.opts.key));
        }
        catch (error) {
        }
    };
    return LocalStorageTransport;
}());
exports.LocalStorageTransport = LocalStorageTransport;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_persistance_LocalStorageTransport) && isObject(module.exports)) {
		Object.assign(_src_persistance_LocalStorageTransport, module.exports);
		return;
	}
	_src_persistance_LocalStorageTransport = module.exports;
}());
// end:source ./ModuleSimplified.js


// source ./ModuleSimplified.js
var _src_workers_CachedWorker;
(function () {
    // ensure AMD is not active for the model, so that any UMD exports as commonjs
    var define = null;
	var exports = {};
	var module = { exports: exports };
	"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FsTransport_1 = _src_persistance_FsTransport;
var LocalStorageTransport_1 = _src_persistance_LocalStorageTransport;
var Cache_1 = _src_Cache;
var CachedWorker = /** @class */ (function () {
    function CachedWorker(opts) {
        var _a;
        this.opts = opts;
        var persistance = (_a = opts.persistance, (_a !== null && _a !== void 0 ? _a : this.getTransport()));
        if (persistance) {
            persistance.debounceMs = 0;
        }
        this.cache = new Cache_1.Cache({
            persistance: persistance,
            maxAge: opts.maxAge,
            monitors: opts.monitors,
        });
        this.worker = opts.worker;
    }
    CachedWorker.prototype.getTransport = function () {
        var t = this.opts.transport;
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
    };
    CachedWorker.prototype.run = function () {
        var result = this.cache.get('result');
        if (result != null) {
            return result;
        }
        result = this.worker();
        this.cache.set('result', result);
        return result;
    };
    CachedWorker.prototype.runAsync = function () {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.workerDfr, (_a !== null && _a !== void 0 ? _a : (this.workerDfr = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.cache.getAsync('result')];
                                case 1:
                                    result = _a.sent();
                                    if (result) {
                                        return [2 /*return*/, result];
                                    }
                                    return [4 /*yield*/, this.opts.worker()];
                                case 2:
                                    result = _a.sent();
                                    return [4 /*yield*/, this.cache.setAsync('result', result)];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/, result];
                            }
                        });
                    }); })())))];
            });
        });
    };
    CachedWorker.run = function (opts) {
        return new CachedWorker(opts).run();
    };
    CachedWorker.runAsync = function (opts) {
        return new CachedWorker(opts).runAsync();
    };
    return CachedWorker;
}());
exports.CachedWorker = CachedWorker;
;

	function isObject(x) {
		return x != null && typeof x === 'object' && x.constructor === Object;
	}
	if (isObject(_src_workers_CachedWorker) && isObject(module.exports)) {
		Object.assign(_src_workers_CachedWorker, module.exports);
		return;
	}
	_src_workers_CachedWorker = module.exports;
}());
// end:source ./ModuleSimplified.js

"use strict";
var memoize_1 = _src_deco_memoize;
var debounce_1 = _src_deco_debounce;
var throttle_1 = _src_deco_throttle;
var queued_1 = _src_deco_queued;
var memoize_2 = _src_fn_memoize;
var Cache_1 = _src_Cache;
var FsTransport_1 = _src_persistance_FsTransport;
var LocalStorageTransport_1 = _src_persistance_LocalStorageTransport;
var CachedWorker_1 = _src_workers_CachedWorker;
var queued_2 = _src_fn_queued;
var Memd = /** @class */ (function () {
    function Memd() {
    }
    Memd.Cache = Cache_1.Cache;
    Memd.fn = {
        memoize: memoize_2.fn_memoize,
        queued: queued_2.fn_queued,
        clearMemoized: memoize_2.fn_clearMemoized
    };
    Memd.deco = {
        memoize: memoize_1.deco_memoize,
        throttle: throttle_1.deco_throttle,
        debounce: debounce_1.deco_debounce,
        queued: queued_1.deco_queued
    };
    Memd.FsTransport = FsTransport_1.FsTransport;
    Memd.LocalStorageTransport = LocalStorageTransport_1.LocalStorageTransport;
    Memd.CachedWorker = CachedWorker_1.CachedWorker;
    return Memd;
}());
Memd.default = Memd;
module.exports = Memd;


}));

// end:source ./UMD.js
