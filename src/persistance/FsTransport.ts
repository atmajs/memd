import { ITransport } from './ITransport';
import { ICacheEntryCollection } from '../Cache';

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
        let isNode = typeof process === 'undefined' || typeof process.exit !== 'function';
        if (isNode) {
            let useLocalStorage = opts?.browser?.localStorage;
            if (useLocalStorage) {
                this._file = new LocalStorageFile(this.opts.path);
            }
            return;
        }
        /** lazy load require and preventing bundler's build */
        const r = require;
        const module = 'atma-io';
        const FileSafe = r(module).FileSafe;

        this._file = new FileSafe(this.opts.path, { threadSafe: true });
    }

    async restoreAsync () {
        if (this._file == null) {
            return;
        }
        try {
            let json = await this._file.readAsync();
            return typeof json === 'string'
                ? JSON.parse(json)
                : json;
        } catch (error) {
            return {};
        }
    }
    async flushAsync (coll: ICacheEntryCollection) {
        if (this._file == null) {
            return;
        }
        let json = JSON.stringify(coll);
        return await this._file.writeAsync(json);
    }
}

interface IStorage {
    readAsync (): Promise<string>
    writeAsync(content: string): Promise<void>
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
