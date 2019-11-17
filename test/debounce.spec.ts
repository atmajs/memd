import { deco_debounce } from '../src/deco/debounce';
import sinon = require('sinon');

UTest({
    'debounce' (done) {
        const innerFn = sinon.spy();
        class Foo {
            @deco_debounce(50)
            foo () {
                return innerFn()
            }
        }
        let f = new Foo();

        f.foo();
        f.foo();
        f.foo();
        eq_(innerFn.callCount, 0);
        setTimeout(() => {
            eq_(innerFn.callCount, 1);
            done();
        }, 100);
    }
})