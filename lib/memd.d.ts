// Generated by dts-bundle v0.7.3

declare module 'memd' {
    import { deco_memoize } from 'memd/deco/memoize';
    import { deco_debounce } from 'memd/deco/debounce';
    import { deco_throttle } from 'memd/deco/throttle';
    import { deco_queued } from 'memd/deco/queued';
    import { fn_memoize } from 'memd/fn/memoize';
    import { Cache } from 'memd/Cache';
    class Memd {
        static Cache: typeof Cache;
        static fn: {
            memoize: typeof fn_memoize;
        };
        static deco: {
            memoize: typeof deco_memoize;
            throttle: typeof deco_throttle;
            debounce: typeof deco_debounce;
            queued: typeof deco_queued;
        };
        static default: typeof Memd;
    }
    export = Memd;
}

declare module 'memd/deco/memoize' {
    import { ICacheOpts } from 'memd/Cache';
    export function deco_memoize(opts?: ICacheOpts): (target: any, propertyKey: any, descriptor?: any) => any;
}

declare module 'memd/deco/debounce' {
    /**
      *
      * @param timeout ms to wait before calling inner fn
      */
    export function deco_debounce(timeout?: number): (target: any, propertyKey: any, descriptor?: any) => any;
}

declare module 'memd/deco/throttle' {
    /**
      * Calls function maximal each time window frame
      * @param timeWindow how often, in ms, should the function be called
      * @param shouldCallLater start calling fn on frame start
      */
    export function deco_throttle(timeWindow: number, shouldCallLater?: boolean): (target: any, propertyKey: any, descriptor?: any) => any;
}

declare module 'memd/deco/queued' {
    export function deco_queued(opts?: {
        trimQueue: boolean;
    }): (target: any, propertyKey: any, descriptor?: any) => any;
}

declare module 'memd/fn/memoize' {
    import { IMemoizeWrapper } from 'memd/model/IMemoizeWrapper';
    import { ICacheOpts } from 'memd/Cache';
    export function fn_memoize<T extends Function>(fn: T, opts?: ICacheOpts): IMemoizeWrapper<T>;
}

declare module 'memd/Cache' {
    export interface ICacheOpts {
        maxAge?: number;
        monitors?: ICacheChangeEventMonitor[];
        keyResolver?: (...args: any[]) => string;
    }
    export interface ICacheChangeEventMonitor {
        on(event: 'change', fn: Function): any;
        off(event: 'change', fn: Function): any;
    }
    export interface ICacheEntry<T = any> {
        timestamp: number;
        value: T;
    }
    export class Cache<T = any> {
        options: ICacheOpts;
        constructor(options?: ICacheOpts);
        resolveKey(...args: any[]): string;
        get(key: string): T;
        set(key: string, val: T): T;
        clear(key?: string): void;
        destroy(): void;
    }
}

declare module 'memd/model/IMemoizeWrapper' {
    export interface IMemoizeWrapper<T extends Function> {
        (fn: T): T;
        clearArgs(...args: any[]): any;
        clearAll(): any;
    }
}

