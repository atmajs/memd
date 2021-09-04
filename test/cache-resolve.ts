import * as Sinon from 'sinon';
import { Cache } from '../src/Cache'

UTest({
    async 'resolve simple' () {
        let cache = new Cache();
        let random = Math.random() * 10**10  | 0;
        let resolver = Sinon.spy(() => Promise.resolve(random));
        let x = await Cache.resolve(cache, resolver);
        eq_(x, random);

        let y = await Cache.resolve(cache, resolver);
        eq_(y, random);

        eq_(resolver.callCount, 1);
    }
});
