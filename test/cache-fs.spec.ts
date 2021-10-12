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
        File.clearCache();
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
        await cache.setAsync(`timespan.${1}`, rand1);

        let rand2 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${2}`, rand2);

        let rand3 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${3}`, rand3);

        await cache.flushAsync();
        let data = await File.readAsync <string> (path, { skipHooks: true, cached: false });
        has_(data, String(rand1));
        has_(data, String(rand2));
        has_(data, String(rand3));
    },
    async 'fs cache read' () {
        let model = {
            foo: {
                value: Date.now()
            },
        };
        await File.writeAsync(path, model);
        let cache = new Cache({
            persistance: new FsTransport({ path: path })
        });

        let r1 = await cache.getAsync('foo');
        eq_(r1, model.foo.value);
    },
    async 'fs cache multi writes async' () {
        let cache = new Cache({
            persistance: new FsTransport({ path: path })
        });

        let rand1 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${1}`, Promise.resolve(rand1));

        let rand2 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${2}`, Promise.resolve(rand2));

        let rand3 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`timespan.${3}`, Promise.resolve(rand3));

        await cache.flushAsync();
        let data = await File.readAsync <string> (path, { skipHooks: true, cached: false });

        has_(data, String(rand1));
        has_(data, String(rand2));
        has_(data, String(rand3));
    },
    async 'fs writes, then read and write' () {
        let cache = new Cache({
            persistance: new FsTransport({ path: path })
        });

        let rand1 = (Math.random() * 10 ** 5) | 0;
        await cache.setAsync(`foo`, Promise.resolve(rand1));
        await cache.flushAsync();

        let cache2 = new Cache({
            persistance: new FsTransport({ path: path })
        });


        let fooVal = await cache2.getAsync(`foo`);
        eq_(fooVal, rand1);

        let rand2 = (Math.random() * 10 ** 5) | 0;
        await cache2.setAsync(`bar`, Promise.resolve(rand2));

        await cache2.flushAsync();
        let data = await File.readAsync <string> (path, { skipHooks: true, cached: false });

        has_(data, String(rand1));
        has_(data, String(rand2));
    },
})
