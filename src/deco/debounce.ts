const requestFn: any = typeof requestAnimationFrame === 'undefined' ? setImmediate : requestAnimationFrame;
const clearRequest: any = typeof requestAnimationFrame === 'undefined' ? clearImmediate : cancelAnimationFrame;
/**
 * 
 * @param timeoutMs ms to wait before calling inner fn
 */
export function deco_debounce (timeoutMs?: number) {
    return function(target, propertyKey, descriptor?) {
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
            descriptor.value =  function (...args) {
                const self = this;
                if (frame !== 0) {
                    clearRequest(frame);
                }
                frame = requestFn(function() {
                    frame = 0;
                    fn.apply(self, args);
                });
            };
        } else {
            let timer = 0;
            descriptor.value = function (...args) {
                const self = this;
                clearTimeout(timer);
                timer = <any> setTimeout(function() {
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
};