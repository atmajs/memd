import { ITransport } from './Transport';
import { ICacheEntryCollection } from '../Cache';

export interface IFsTransportOpts {
    path: string
}

export class FsTransport implements ITransport {
    private File = <any> null

    isAsync = true;

    constructor (public opts: IFsTransportOpts) {
        if (typeof process === 'undefined' || typeof process.exit !== 'function') {
            throw new Error('NodeJS expected');
        }
        const r = require;
        const module = 'atma-io';
        this.File = r(module).File;
    }

    async restoreAsync () {
        if (await this.File.existsAsync(this.opts.path) === false) {
            return {};
        }
        return this.File.readAsync(this.opts.path);
    }
    flushAsync (coll: ICacheEntryCollection) {
        this.File.writeAsync(this.opts.path, coll);
    }
}