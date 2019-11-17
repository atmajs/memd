/**
 * 
 * @param timeout ms to wait before calling inner fn
 */
export function deco_debounce (timeout?: number) {
    return function(target, propertyKey, descriptor?) {
        let viaProperty = descriptor == null;
        if (viaProperty) {
            descriptor = {
                configurable: true,
                value: target[propertyKey]
            };
        }
        let fn = descriptor.value;
        if (timeout == null || timeout === 0) {
            let frame = 0;
            descriptor.value =  function (...args) {
                const self = this;
                if (frame !== 0) {
                    cancelAnimationFrame(frame);
                }
                frame = requestAnimationFrame(function() {
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
                }, timeout);
            };
        }
        if (viaProperty) {
            target[propertyKey] = descriptor.value;
            return;
        }
        return descriptor;
    };
};