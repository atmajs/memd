import { Deferred } from '../model/Deferred';

interface IQueueOpts {

    /** When the fn is active all further calls will receive active promise */
    single?: boolean

    /** When the fn is called and the queue has already waiters - remove them */
    trimQueue?: boolean
    timeout?: number

    /** the fn call frequence */
    throttle?: number
}

/** For original async method - ensure it is called one after another  */
export function fn_queued<T extends Function>(fn: T, opts: IQueueOpts = {}): T {

    let queue = [] as ReturnType<typeof Queued['prepair']>[];
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
    }
    return resultFn as any as T;
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
