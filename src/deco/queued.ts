import { fn_queued } from '../fn/queued';

export function deco_queued (opts: {
    trimQueue?: boolean,
    timeout?: number,
    throttle?: number
} = null) {
    return function (target, propertyKey, descriptor?) {
        let viaProperty = descriptor == null;
        let fn = viaProperty ? target[propertyKey] : descriptor.value;
        let resultFn = fn_queued(fn, opts);

        if (viaProperty) {
            target[propertyKey] = resultFn;
            return;
        }
        descriptor.value = resultFn;
        return descriptor;
    }
}
