import { class_EventEmitter } from 'atma-utils'
import { deco_memoize } from '../src/deco/memoize';
import sinon = require('sinon');

UTest({
    'memoize' () {
        const innerFn = sinon.spy(function (letter) {
            return letter.toUpperCase();
        });
        class Foo {
            @deco_memoize()
            foo (letter) {
                return innerFn(letter)
            }
        }

        let f = new Foo();

        f.foo('a');
        f.foo('a');
        eq_(f.foo('a'), 'A');
        eq_(innerFn.callCount, 1);

        eq_(f.foo('b'), 'B');
        eq_(innerFn.callCount, 2);

        (f.foo as any).clearAll();
        eq_(f.foo('a'), 'A');
        eq_(innerFn.callCount, 3);
    },
    'memoize with maxAge' (done) {
        const innerFn = sinon.spy(function (letter) {
            return letter.toUpperCase();
        });
        class Foo {
            @deco_memoize({ maxAge: 50 })
            foo (letter) {
                return innerFn(letter)
            }
        }

        let f = new Foo();

        f.foo('a');
        f.foo('a');
        eq_(f.foo('a'), 'A');
        eq_(innerFn.callCount, 1);

        setTimeout(function () {
            f.foo('a');
            eq_(f.foo('a'), 'A');
            eq_(innerFn.callCount, 2);
            done();
        }, 100);
    },
    'memoize with invalidation' () {
        const innerFn = sinon.spy(function (letter) {
            return letter.toUpperCase();
        });
        const invalidation = new class_EventEmitter()
        class Foo {
            @deco_memoize({ monitors: [ invalidation ] })
            foo (letter) {
                return innerFn(letter)
            }
        }

        let f = new Foo();

        f.foo('a');
        f.foo('a');
        eq_(f.foo('a'), 'A');
        eq_(innerFn.callCount, 1);

        invalidation.emit('change');
        f.foo('a');
        eq_(f.foo('a'), 'A');
        eq_(innerFn.callCount, 2);
    }
})