
import * as sinon from 'sinon';
import { deco_throttle } from '../src/deco/throttle';

UTest({
    'throttle' (done) {
        const innerFn = sinon.spy();
        class Foo {
            @deco_throttle(50)
            foo (num) {
                return innerFn(num)
            }
        }
        let f = new Foo();

        f.foo(1);
        f.foo(2);
        f.foo(3);
        eq_(innerFn.callCount, 1);
        setTimeout(() => {
            eq_(innerFn.callCount, 2);

            f.foo(4);
            f.foo(5);
            f.foo(6);
            eq_(innerFn.callCount, 3);

            setTimeout(() => {
                eq_(innerFn.callCount, 4);

                deepEq_(innerFn.args, [
                    [1],
                    [3],
                    [4],
                    [6],
                ]);
                done();
            }, 150);
        }, 150);
    },
    'throttle per arguments' (done) {
        const innerFn = sinon.spy();
        class Foo {
            @deco_throttle(50, { perArguments: true })
            foo (num) {
                return innerFn(num)
            }
        }
        let f = new Foo();

        f.foo(1);
        f.foo(1);
        f.foo(1);
        f.foo(2);
        f.foo(2);
        eq_(innerFn.callCount, 2);
        deepEq_(innerFn.args, [
            [1],
            [2],
        ]);


        setTimeout(() => {
            eq_(innerFn.callCount, 4);
            deepEq_(innerFn.args, [
                [1],
                [2],
                [1],
                [2],
            ]);


            f.foo(2);
            eq_(innerFn.callCount, 5);

            setTimeout(() => {
                eq_(innerFn.callCount, 5);

                deepEq_(innerFn.args, [
                    [1],
                    [2],
                    [1],
                    [2],
                    [2],
                ]);
                done();
            }, 150);
        }, 150);
    }
})
