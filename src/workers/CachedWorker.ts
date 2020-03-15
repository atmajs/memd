import { IFsTransportOpts, FsTransport } from '../persistance/FsTransport';
import { ILocalStorageTransport, LocalStorageTransport } from '../persistance/LocalStorageTransport';
import { Cache } from '../Cache';
import { ITransport } from '../persistance/Transport';
import { ICacheOpts } from '../Cache';

export interface ICachedWorkerOptions <T> {
    transport: IFsTransportOpts | ILocalStorageTransport
    worker: () => (T | Promise<T>)
}

export class CachedWorker <T> {
    
    private cache: Cache
    private worker: () => (T | Promise<T>)
    private workerDfr: Promise<any>;

    constructor (private opts: ICachedWorkerOptions<T> & ICacheOpts) {
        const persistance = opts.persistance ?? this.getTransport();
        if (persistance) {
            persistance.debounceMs = 0;
        }
        this.cache = new Cache({
            persistance,
            maxAge: opts.maxAge,
            monitors: opts.monitors,
        });
        this.worker = opts.worker;
    }

    private getTransport (): ITransport {
        let t = this.opts.transport;
        if (t == null) {
            return null;
        }
        if ('path' in t) {
            return new FsTransport(t);
        }
        if ('key' in t) {
            return new LocalStorageTransport(t);
        }
        throw new Error('Invalid transport options');
    }

    run <T> (): T {
        let result = this.cache.get('result');
        if (result != null) {
            return result;
        }
        result = this.worker();
        this.cache.set('result', result);
        return result;
    }
    async runAsync <T> (): Promise <T> {
        return this.workerDfr ?? (this.workerDfr = (async () => {
            let result = await this.cache.getAsync('result');
            if (result) {
                return result;
            }
            result = await this.opts.worker();
            await this.cache.setAsync('result', result);
            return result;
        })());
    }

    static run <T> (opts: ICachedWorkerOptions<T> & ICacheOpts): T {
        return new CachedWorker(opts).run();
    }
    static runAsync <T> (opts: ICachedWorkerOptions<T> & ICacheOpts): Promise <T> {
        return new CachedWorker(opts).runAsync();
    }
}