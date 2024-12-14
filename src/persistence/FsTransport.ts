import type { FileSafe } from 'atma-io';
import { ITransport } from './ITransport';
import { ICacheEntryCollection } from '../Cache';
import { requireLib } from '../utils/requireLib';

export interface IFsTransportOpts {
    path: string
    browser?: {
        localStorage?: boolean
    }
}

export class FsTransport implements ITransport {
    private _file: IStorage = null

    isAsync = true;

    constructor (public opts: IFsTransportOpts) {


    }

    async restoreAsync () {
        let file = await this.getFileSafeCtor()
        if (file == null) {
            return;
        }

        try {
            let json = await file.readAsync();
            return typeof json === 'string'
                ? JSON.parse(json)
                : json;
        } catch (error) {
            return {};
        }
    }
    async flushAsync (coll: ICacheEntryCollection) {
        let file = await this.getFileSafeCtor()
        if (file == null) {
            return;
        }
        let json = JSON.stringify(coll);
        return await file.writeAsync(json);
    }

    private async getFileSafeCtor () {
        let isBrowser = typeof process === 'undefined' || typeof process.exit !== 'function';
        if (isBrowser) {
            let useLocalStorage = this.opts?.browser?.localStorage;
            if (useLocalStorage) {
                this._file = new LocalStorageFile(this.opts.path);
            }
            return null;
        }

        const { path } = this.opts;
        if (path in CACHED_STORAGES) {
            this._file = CACHED_STORAGES[path];
        } else {
            /** lazy load require and preventing bundler's build */
            const module = await requireLib.load<{ FileSafe: typeof FileSafe }>('atma-io');
            const FileSafeCtor = module.FileSafe;

            this._file = new FileSafeCtor(this.opts.path, { threadSafe: true });
            CACHED_STORAGES[path] = this._file;
        }
        return this._file;
    }
}

interface IStorage {
    readAsync (): Promise<string>
    writeAsync(content: string): Promise<any>
}

class LocalStorageFile implements IStorage {
    private key = `memd:fs:${this.path}`;

    constructor (public path: string) {

    }
    async readAsync(): Promise<string> {
        return localStorage.getItem(this.key);
    }
    async writeAsync(content: string): Promise<void> {
        localStorage.setItem(this.key, content);
    }
}

const CACHED_STORAGES = {} as {
    [ path: string ]: IStorage
}
