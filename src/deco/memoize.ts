import { ICacheOpts } from '../Cache';
import { fn_memoize, IMemoizeOpts } from '../fn/memoize';

export function deco_memoize (opts?: ICacheOpts & IMemoizeOpts) {

    return function (target, propertyKey, descriptor?) {
        const viaProperty = descriptor == null;
        const isGetter = !viaProperty && typeof descriptor.get === 'function';

        const innerFn = viaProperty
            ? target[propertyKey]
            : (isGetter ? descriptor.get : descriptor.value);

        const fn = fn_memoize(innerFn, opts, propertyKey);
        if (viaProperty) {
            target[propertyKey] = fn;
            return;
        }
        if (isGetter) {
            descriptor.get = fn;
        } else {
            descriptor.value = fn;
        }
        return descriptor;
    };
}
