import { Deferred } from '../model/Deferred';

export function deco_queued (opts: { trimQueue?: boolean, timeout?: number } = null) {
    return function (target, propertyKey, descriptor?) {
        let viaProperty = descriptor == null;
        let fn = viaProperty ? target[propertyKey] : descriptor.value;
        let queue = [] as ReturnType<typeof Queued['prepair']>[];
        let busy = false;
        let resultFn = function (...args) {
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
    prepair(innerFn: Function, ctx, args: any[], opts?: { timeout?: number }) {
        let dfr = new Deferred;
        let completed = false;
        let timeout = null;
        return {
            promise: dfr,
            run() {
                let result = innerFn.apply(ctx, args);
                if ('then' in result === false) {
                    dfr.resolve(result);
                } else {
                    if (opts?.timeout > 0) {
                        timeout = setTimeout(() => {
                            if (completed) {
                                return;
                            }
                            dfr.reject(new Error(`Queue Worker: the inner function ${innerFn.name} timeouted: ${opts.timeout}`));
                        }, opts.timeout)
                    }
                    result.then(
                        _result => {
                            if (timeout != null) {
                                clearTimeout(timeout);
                            }
                            if (completed) {
                                return;
                            }
                            completed = true;
                            dfr.resolve(_result);
                        },
                        _error => {
                            if (timeout != null) {
                                clearTimeout(timeout);
                            }
                            if (completed) {
                                return;
                            }
                            completed = true;
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
