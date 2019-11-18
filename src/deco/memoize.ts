import { ICacheOpts } from '../Cache';
import { fn_memoize, IMemoizeOpts } from '../fn/memoize';

export function deco_memoize (opts?: ICacheOpts & IMemoizeOpts) {

    return function (target, propertyKey, descriptor?) {
        const viaProperty = descriptor == null;
        const fn = fn_memoize(viaProperty ? target[propertyKey] : descriptor.value, opts, propertyKey);
        if (viaProperty) {
            target[propertyKey] = fn;
            return;
        }
        descriptor.value = fn;
        return descriptor;
    };
}