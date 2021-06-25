import { Cache } from '../src/Cache'
import { FsTransport } from '../src/persistance/FsTransport'
import { File } from 'atma-io';


const path = `./test/tmp/fs-cache-test.json`;
UTest({
    $before () {
        File.exists(path) && File.remove(path);
    },
    async 'fs cache' () {
        let cache = new Cache({
            persistance: new FsTransport({ path: path })
        });

        let time = Date.now();
        await cache.setAsync('timespan', time);
        await cache.flushAsync();


        let data = await File.readAsync <string> (path, { skipHooks: true });
        has_(data, String(time));
        console.log(data);
    }
})
