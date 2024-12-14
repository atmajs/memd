import { ICacheEntry, ICacheOpts } from '../Cache';
import { IStore } from './IStore';

export class StoreWorker <T = any>  {
    public isAsync = false;

    private doNotWaitSave = false;

    constructor (private store: IStore, public options: ICacheOpts = {}) {
        this.isAsync = this.store.getAsync != null
        this.doNotWaitSave = options?.doNotWaitSave === true;
    }

    get?(key: string, ...args): ICacheEntry<T> {
        return this.store.get(key);
    }

    getAsync?(key: string, ...args): Promise<ICacheEntry<T>> {
        return this.store.getAsync(key, ...args);
    }

    save?(key: string, val: ICacheEntry<T>): void {
        this.store.save(key, val);
    }

    saveAsync?(key: string, val: ICacheEntry<T>): Promise<void> {
        let promise = this.store.saveAsync(key, val);
        if (this.doNotWaitSave === true) {
            return null;
        }
        return promise;
    }

    clear?(key: string): void {
        this.store.clear(key);
    }

    clearAsync?(key: string): Promise<void> {
        return this.store.clearAsync(key);
    }
}
