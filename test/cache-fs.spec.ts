import { Cache } from '../src/Cache'
import { FsTransport } from '../src/persistance/FsTransport'
import { File } from 'atma-io';


const path = `./test/tmp/fs-cache-test.json`;
UTest({
    $before () {
        File.exists(path) && File.remove(path);
    },
    $teardown () {
        File.exists(path) && File.remove(path);
    },
    async 'fs cache' () {
        let cache = new Cache({
            persistance: new FsTransport({ path: path })
        });

        let time = Date.now();
        await cache.setAsync('timespan', time);
        await cache.flushAsync();


        let data = await File.readAsync <string> (path, { skipHooks: true, cached: false });
        has_(data, String(time));
    },
    async 'fs cache multi writes' () {
        let cache = new Cache({
            persistance: new FsTransport({ path: path })
        });

        let rand1 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${rand1}`, rand1);

        let rand2 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${rand2}`, rand2);

        let rand3 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${rand3}`, rand3);

        await cache.flushAsync();
        let data = await File.readAsync <string> (path, { skipHooks: true, cached: false });
        has_(data, String(rand1));
        has_(data, String(rand2));
        has_(data, String(rand3));
        console.log(data);
    }
})
