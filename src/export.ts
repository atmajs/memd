import { deco_memoize } from './deco/memoize';
import { deco_debounce } from './deco/debounce';
import { deco_throttle } from './deco/throttle';
import { deco_queued } from './deco/queued';
import { fn_memoize } from './fn/memoize';
import { Cache } from './Cache'
import { FsTransport } from './persistance/FsTransport';
import { LocalStorageTransport } from './persistance/LocalStorageTransport';
import { CachedWorker } from './workers/CachedWorker';

class Memd {

    static Cache = Cache
    static fn = {
        memoize: fn_memoize
    }
    static deco = {
        memoize: deco_memoize,
        throttle: deco_throttle,
        debounce: deco_debounce,
        queued: deco_queued
    }
    static FsTransport = FsTransport
    static LocalStorageTransport = LocalStorageTransport
    static CachedWorker = CachedWorker

    static default: typeof Memd
}

Memd.default = Memd;


export = Memd;
