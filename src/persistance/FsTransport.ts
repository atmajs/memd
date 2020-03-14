import { ITransport } from './Transport';
import { ICacheEntryCollection } from '../Cache';

export interface IFsTransport {
    path: string
}

export class FsTransport implements ITransport {
    private File = <any> null

    isAsync = true;

    constructor (public opts: IFsTransport) {
        if (typeof process === 'undefined' || typeof process.exit !== 'function') {
            throw new Error('NodeJS expected');
        }
        const r = require;
        const module = 'atma-io';
        File = r(module);
    }

    restoreAsync () {
        return this.File.readAsync(this.opts.path);
    }
    flushAsync (coll: ICacheEntryCollection) {
        this.File.writeAsync(this.opts.path, coll);
    }
}