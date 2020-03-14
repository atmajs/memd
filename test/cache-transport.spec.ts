import { Cache } from '../src/Cache'
import { ITransport } from '../src/persistance/Transport'

class Mem implements ITransport{
    mem = null
    isAsync = false
    debounceMs = 0
    flush (x) {
        this.mem = x;
    }
    restore () {
        return this.mem as any;
    }
}

UTest({
    'should save values' () {
        let db = new Mem;
        let cache = new Cache({
            persistance: db
        });
        cache.set('foo', 'bar');
        eq_(db.mem.foo.value, 'bar');
    },
    'should restore values' () {
        let db = new (class extends Mem{
            mem = {
                foo: { value: 'baz' }
            }
        });
        let cache = new Cache({
            persistance: db
        });
        let val = cache.get('foo');
        eq_(val, 'baz');

        '> should clear cache and persistance'
        cache.clear();
        let val2 = cache.get('foo');
        eq_(val2, null);
    },
    'should skip outdated' () {
        let ageMs = 30 * 24 * 60 * 60 * 1000;
        let db = new (class extends Mem{
            mem = {
                foo: { 
                    timestamp: Date.now() - ageMs,
                    value: 'baz'
                }
            }
        });
        
        let cacheValid = new Cache({
            persistance: db,
            maxAge: ageMs / 1000 + 1
        });
        let val1 = cacheValid.get('foo');
        eq_(val1, 'baz', 'Not outdated');

        let cacheOutdated = new Cache({
            persistance: db,
            maxAge: ageMs / 1000 - 1
        });
        let val2 = cacheOutdated.get('foo');
        eq_(val2, null, 'Outdated');
    }

})