import { ITransport } from './ITransport';
import { ICacheEntryCollection } from '../Cache';

export interface IFsTransportOpts {
    path: string
}

export class FsTransport implements ITransport {
    private _file = <any> null

    isAsync = true;

    constructor (public opts: IFsTransportOpts) {
        if (typeof process === 'undefined' || typeof process.exit !== 'function') {
            throw new Error('NodeJS expected');
        }
        const r = require;
        const module = 'atma-io';
        const FileSafe = r(module).FileSafe;

        this._file = new FileSafe(this.opts.path, { threadSafe: true });
    }

    async restoreAsync () {
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
        let json = JSON.stringify(coll);
        return await this._file.writeAsync(json);
    }
}
