import { ICacheEntry } from '../Cache';

export interface IStore<T = any> {

    get?(key: string, ...args): ICacheEntry<T>;
    getAsync?(key: string, ...args): Promise<ICacheEntry<T>>;

    save?(key: string, entry: ICacheEntry<T>): void;
    saveAsync?(key: string, entry: ICacheEntry<T>): Promise<void>;

    clear?(key: string): void;
    clearAsync?(key: string): Promise<void>;
}
