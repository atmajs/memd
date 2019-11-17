/**
 * Calls function maximal each time window frame
 * @param timeWindow how often, in ms, should the function be called
 * @param shouldCallLater start calling fn on frame start
 */
export function deco_throttle (timeWindow: number, shouldCallLater?: boolean) {
    return function(target, propertyKey, descriptor?) {
        let viaProperty = descriptor == null;
        let fn = viaProperty ? target[propertyKey] : descriptor.value;
        let timer = 0;
        let latestArgs = null;
        let latestCall = 0;
        let resultFn = function (...args) {
            let self = this;
            let now = Date.now();
            let diff = now - latestCall;
            if (diff >= timeWindow) {
                latestCall = now;
                if (shouldCallLater !== true) {
                    fn.apply(self, args);
                    return;
                }                    
            }
            latestArgs = args;
            if (timer === 0) {
                timer = <any> setTimeout(function (){
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
    }
}