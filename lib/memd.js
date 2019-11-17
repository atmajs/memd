
// source ./UMD.js
(function(factory){
	
	var _name = 'memd',
		_global = typeof window === 'undefined' ? global : window,
		_module = {
			exports: {}
		};

	factory(_module, _module.exports, _global);

	if (typeof define === 'function' && define.amd) {
        define([], function () {
        	return _module.exports;
        });
        return;
    } 
    if (typeof module === 'object' && module.exports) {
    	module.exports = _module.exports;
    	return;
    }

	if (_name) {
		_global[_name] = _module.exports;
	}

}(function(module, exports, global){
	var _src_Cache = {};
var _src_deco_debounce = {};
var _src_deco_memoize = {};
var _src_deco_queued = {};
var _src_deco_throttle = {};
var _src_fn_Args = {};
var _src_fn_memoize = {};
var _src_model_Deferred = {};

// source ./ModuleSimplified.js
var _src_fn_Args;
(function () {
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Args;
(function (Args) {
    function getKey(args) {
        var key = '';
        for (var i = 0; i < args.length; i++) {
            key += '.' + getKeySingle(args[i]);
        }
        return key;
    }
    Args.getKey = getKey;
    function getKeySingle(x) {
        if (typeof x !== 'object') {
            return x;
        }
        var str = '';
        for (var key in x) {
            str += '.' + getKeySingle(x[key]);
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
var _src_Cache;
(function () {
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
var Args_1 = _src_fn_Args;
var Cache = /** @class */ (function () {
    function Cache(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.options = options;
        this._cache = {};
        if (this.options.monitors) {
            this.onChanged = this.onChanged.bind(this);
            options.monitors.forEach(function (x) { return x.on('change', _this.onChanged); });
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
        var entry = this._cache[key];
        if (entry == null) {
            return null;
        }
        if (this.options.maxAge && ((Date.now() - entry.timestamp) / 1000) > this.options.maxAge) {
            this.clear(key);
            return null;
        }
        return entry.value;
    };
    Cache.prototype.set = function (key, val) {
        this._cache[key] = {
            timestamp: Date.now(),
            value: val
        };
        return val;
    };
    Cache.prototype.clear = function (key) {
        if (typeof key === 'string') {
            this._cache[key] = null;
            return;
        }
        this._cache = {};
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
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cache_1 = _src_Cache;
function fn_memoize(fn, opts) {
    if (opts === void 0) { opts = {}; }
    var _cache = new Cache_1.Cache(opts);
    var Wrapper = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        var id = _cache.resolveKey.apply(_cache, args);
        return _a = _cache.get(id), (_a !== null && _a !== void 0 ? _a : (_cache.set(id, fn.apply(this, args))));
    };
    Wrapper.clearArgs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var id = _cache.resolveKey.apply(_cache, args);
        _cache.clear(id);
    };
    Wrapper.clearAll = function () {
        _cache.clear();
    };
    return Wrapper;
}
exports.fn_memoize = fn_memoize;
;
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
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memoize_1 = _src_fn_memoize;
function deco_memoize(opts) {
    return function (target, propertyKey, descriptor) {
        var viaProperty = descriptor == null;
        var fn = memoize_1.fn_memoize(viaProperty ? target[propertyKey] : descriptor.value, opts);
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
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requestFn = typeof requestAnimationFrame === 'undefined' ? setImmediate : requestAnimationFrame;
var clearRequest = typeof requestAnimationFrame === 'undefined' ? clearImmediate : cancelAnimationFrame;
/**
 *
 * @param timeout ms to wait before calling inner fn
 */
function deco_debounce(timeout) {
    return function (target, propertyKey, descriptor) {
        var viaProperty = descriptor == null;
        if (viaProperty) {
            descriptor = {
                configurable: true,
                value: target[propertyKey]
            };
        }
        var fn = descriptor.value;
        if (timeout == null || timeout === 0) {
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
                }, timeout);
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
var _src_deco_queued;
(function () {
	var exports = {};
	var module = { exports: exports };
	"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Deferred_1 = _src_model_Deferred;
function deco_queued(opts) {
    if (opts === void 0) { opts = null; }
    return function (target, propertyKey, descriptor) {
        var viaProperty = descriptor == null;
        var fn = viaProperty ? target[propertyKey] : descriptor.value;
        var queue = [];
        var busy = false;
        var resultFn = function () {
            var wrapped = Queued.prepair(fn, this);
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
            var x = queue.shift();
            if (x == null) {
                busy = false;
                return;
            }
            x.always(tick);
            x.run.apply(this, arguments);
        };
        if (viaProperty) {
            target[propertyKey] = resultFn;
            return;
        }
        descriptor.value = resultFn;
        return descriptor;
    };
}
exports.deco_queued = deco_queued;
var Queued = {
    prepair: function (innerFn, ctx) {
        var dfr = new Deferred_1.Deferred;
        return {
            promise: dfr,
            run: function () {
                var result = innerFn.apply(ctx, arguments);
                if ('then' in result === false) {
                    dfr.resolve(result);
                }
                else {
                    result.then(function (_result) {
                        dfr.resolve(_result);
                    }, function (_error) {
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
	if (isObject(_src_deco_queued) && isObject(module.exports)) {
		Object.assign(_src_deco_queued, module.exports);
		return;
	}
	_src_deco_queued = module.exports;
}());
// end:source ./ModuleSimplified.js

"use strict";
var memoize_1 = _src_deco_memoize;
var debounce_1 = _src_deco_debounce;
var throttle_1 = _src_deco_throttle;
var queued_1 = _src_deco_queued;
var memoize_2 = _src_fn_memoize;
var Cache_1 = _src_Cache;
var Memd = /** @class */ (function () {
    function Memd() {
    }
    Memd.Cache = Cache_1.Cache;
    Memd.fn = {
        memoize: memoize_2.fn_memoize
    };
    Memd.deco = {
        memoize: memoize_1.deco_memoize,
        throttle: throttle_1.deco_throttle,
        debounce: debounce_1.deco_debounce,
        queued: queued_1.deco_queued
    };
    return Memd;
}());
Memd.default = Memd;
module.exports = Memd;

}));
// end:source ./UMD.js
