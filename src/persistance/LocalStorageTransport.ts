import { ITransport } from './Transport';
import { ICacheEntryCollection } from '../Cache';

export interface ILocalStorageTransport {
    key: string
}

export class LocalStorageTransport implements ITransport {
    isAsync = false;

    constructor (public opts: ILocalStorageTransport) {
        if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') {
            throw new Error('Browser expected');
        }
    }

    restore () {
        try {
            return JSON.parse(localStorage.getItem(this.opts.key))
        } catch (error) {

        }
    }
    flush (coll: ICacheEntryCollection) {
        try {
            localStorage.getItem(JSON.stringify(this.opts.key));
        } catch (error) {

        }
    }
}