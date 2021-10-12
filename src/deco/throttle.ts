import { Args } from '../fn/Args';
import { Deferred } from '../model/Deferred';

interface IThrottleOptions {

    /** Regarding the 1 fn call. The fn will be called at the end of the throttle frame */
    shouldCallLater?: boolean

    /** Use arguments as throttled key */
    perArguments?: boolean
}

/**
 * Calls function maximal each time window frame
 * @param timeWindow how often, in ms, should the function be called
 * @param shouldCallLater start calling fn on frame start
 */
export function deco_throttle (timeWindow: number, shouldCallLater?: boolean)
export function deco_throttle (timeWindow: number, options?: IThrottleOptions)
export function deco_throttle (timeWindow: number, mix?: boolean | IThrottleOptions) {

    let options = typeof mix === 'boolean'
        ? { shouldCallLater: mix }
        : mix;

    let shouldCallLater = options?.shouldCallLater ?? false;
    let perArguments = options?.perArguments ?? false;
    let perArgumentInfos: {
        latestCall: number
        latestArgs: any[]
        timer: number
        promise: Deferred
    } = perArguments ? Object.create(null) : null;

    return function(target, propertyKey, descriptor?) {
        let viaProperty = descriptor == null;
        let fn = viaProperty ? target[propertyKey] : descriptor.value;
        let timer = 0;
        let latestArgs = null;
        let latestCall = 0;
        let promise = null;
        let resultFn = function (...args) {
            let _key = perArguments !== true ? null : Args.getKey(args);
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
                _promise = promise = new Deferred();
                if (perArguments) {
                    _meta.promise = _promise;
                }

                _timer = <any> setTimeout(function (){
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
    }
}
