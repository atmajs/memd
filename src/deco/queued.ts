import { Deferred } from '../model/Deferred';

export function deco_queued (opts: { trimQueue?: boolean, } = null) {
    return function (target, propertyKey, descriptor?) {
        let viaProperty = descriptor == null;
        let fn = viaProperty ? target[propertyKey] : descriptor.value;
        let queue = [];
        let busy = false;
        let resultFn = function (...args) {
            let wrapped = Queued.prepair(fn, this, args);
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
            let x = queue.shift();
            if (x == null) {
                busy = false;
                return;
            }
            x.always(tick);
            x.run();
        };

        if (viaProperty) {
            target[propertyKey] = resultFn;
            return;
        }
        descriptor.value = resultFn;
        return descriptor;
    }
}


const Queued = {
    prepair(innerFn: Function, ctx, args: any[]) {
        let dfr = new Deferred;
        return {
            promise: dfr,
            run() {
                let result = innerFn.apply(ctx, args);
                if ('then' in result === false) {
                    dfr.resolve(result);
                } else {
                    result.then(
                        _result => {
                            dfr.resolve(_result);
                        },
                        _error => {
                            dfr.reject(_error);
                        }
                    );
                }
                return result;
            },
            always(fn) {
                dfr.then(fn, fn);
            }
        };
    }
}