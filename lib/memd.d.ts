// Generated by dts-bundle v0.7.3

declare module 'memd' {
    import { deco_memoize } from 'memd/deco/memoize';
    import { deco_debounce } from 'memd/deco/debounce';
    import { deco_throttle } from 'memd/deco/throttle';
    import { deco_queued } from 'memd/deco/queued';
    import { fn_memoize } from 'memd/fn/memoize';
    import { Cache } from 'memd/Cache';
    import { FsTransport } from 'memd/persistance/FsTransport';
    import { LocalStorageTransport } from 'memd/persistance/LocalStorageTransport';
    import { CachedWorker } from 'memd/workers/CachedWorker';
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
        static FsTransport: typeof FsTransport;
        static LocalStorageTransport: typeof LocalStorageTransport;
        static CachedWorker: typeof CachedWorker;
        static default: typeof Memd;
    }
    export = Memd;
}

declare module 'memd/deco/memoize' {
    import { ICacheOpts } from 'memd/Cache';
    import { IMemoizeOpts } from 'memd/fn/memoize';
    export function deco_memoize(opts?: ICacheOpts & IMemoizeOpts): (target: any, propertyKey: any, descriptor?: any) => any;
}

declare module 'memd/deco/debounce' {
    /**
      *
      * @param timeoutMs ms to wait before calling inner fn
      */
    export function deco_debounce(timeoutMs?: number): (target: any, propertyKey: any, descriptor?: any) => any;
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
        trimQueue?: boolean;
    }): (target: any, propertyKey: any, descriptor?: any) => any;
}

declare module 'memd/fn/memoize' {
    import { IMemoizeWrapper } from 'memd/model/IMemoizeWrapper';
    import { ICacheOpts } from 'memd/Cache';
    export interface IMemoizeOpts {
        perInstance?: boolean;
        clearOnReject?: boolean;
        clearOn?: (val: any) => boolean;
    }
    export function fn_memoize<T extends Function>(fn: T, opts?: ICacheOpts & IMemoizeOpts, key?: string): IMemoizeWrapper & T;
}

declare module 'memd/Cache' {
    import { ITransport } from 'memd/persistance/Transport';
    export interface ICacheOpts {
        maxAge?: number;
        monitors?: ICacheChangeEventMonitor[];
        keyResolver?: (...args: any[]) => string;
        persistance?: ITransport;
    }
    export interface ICacheChangeEventMonitor {
        on(event: 'change', fn: Function): any;
        off(event: 'change', fn: Function): any;
    }
    export interface ICacheEntry<T = any> {
        timestamp: number;
        value: T;
    }
    export interface ICacheEntryCollection<T = any> {
        [key: string]: ICacheEntry<T>;
    }
    export class Cache<T = any> {
        options: ICacheOpts;
        constructor(options?: ICacheOpts);
        resolveKey(...args: any[]): string;
        get(key: string): T;
        getAsync(key: string): Promise<T>;
        set(key: string, val: T): T;
        setAsync(key: string, val: T): Promise<T>;
        setCollection(coll: ICacheEntryCollection): void;
        clear(key?: string): void;
        clearAsync(key?: string): Promise<void>;
        destroy(): void;
    }
}

declare module 'memd/persistance/FsTransport' {
    import { ITransport } from 'memd/persistance/Transport';
    import { ICacheEntryCollection } from 'memd/Cache';
    export interface IFsTransportOpts {
        path: string;
    }
    export class FsTransport implements ITransport {
        opts: IFsTransportOpts;
        isAsync: boolean;
        constructor(opts: IFsTransportOpts);
        restoreAsync(): Promise<any>;
        flushAsync(coll: ICacheEntryCollection): any;
    }
}

declare module 'memd/persistance/LocalStorageTransport' {
    import { ITransport } from 'memd/persistance/Transport';
    import { ICacheEntryCollection } from 'memd/Cache';
    export interface ILocalStorageTransport {
        key: string;
    }
    export class LocalStorageTransport implements ITransport {
        opts: ILocalStorageTransport;
        isAsync: boolean;
        constructor(opts: ILocalStorageTransport);
        restore(): any;
        flush(coll: ICacheEntryCollection): void;
    }
}

declare module 'memd/workers/CachedWorker' {
    import { IFsTransportOpts } from 'memd/persistance/FsTransport';
    import { ILocalStorageTransport } from 'memd/persistance/LocalStorageTransport';
    import { ICacheOpts } from 'memd/Cache';
    export interface ICachedWorkerOptions<T> {
        transport: IFsTransportOpts | ILocalStorageTransport;
        worker: () => (T | Promise<T>);
    }
    export class CachedWorker<T> {
        constructor(opts: ICachedWorkerOptions<T> & ICacheOpts);
        run<T>(): T;
        runAsync<T>(): Promise<T>;
        static run<T>(opts: ICachedWorkerOptions<T> & ICacheOpts): T;
        static runAsync<T>(opts: ICachedWorkerOptions<T> & ICacheOpts): Promise<T>;
    }
}

declare module 'memd/model/IMemoizeWrapper' {
    export interface IMemoizeWrapper {
        clearArgs(...args: any[]): any;
        clearAll(): any;
    }
}

declare module 'memd/persistance/Transport' {
    import { ICacheEntryCollection } from 'memd/Cache';
    export interface ITransport<T = any> {
        isAsync: boolean;
        debounceMs?: number;
        restore?(): ICacheEntryCollection<T>;
        restoreAsync?(): Promise<ICacheEntryCollection<T>>;
        flush?(data: ICacheEntryCollection<T>): any;
        flushAsync?(data: ICacheEntryCollection<T>): any;
    }
}

