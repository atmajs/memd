import { class_EventEmitter } from 'atma-utils'
import { deco_memoize } from '../src/deco/memoize';
import { fn_memoize } from '../src/fn/memoize';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';

UTest({
    'memoize'() {
        const innerFn = sinon.spy(function (letter) {
            return letter.toUpperCase();
        });
        class Foo {
            @deco_memoize()
            foo(letter) {
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
    'memoize with maxAge'(done) {
        const innerFn = sinon.spy(function (letter) {
            return letter.toUpperCase();
        });
        class Foo {
            @deco_memoize({ maxAge: .100 })
            foo(letter) {
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
        }, 200);
    },
    'memoize with invalidation'() {
        const innerFn = sinon.spy(function (letter) {
            return letter.toUpperCase();
        });
        const invalidation = new class_EventEmitter()
        class Foo {
            @deco_memoize({ monitors: [invalidation] })
            foo(letter) {
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
    },
    'memoize with clear on': {
        async 'using async'() {
            const arr = [2, 1, 2, 4, 2];
            const innerFn = sinon.spy(function (letter) {
                return arr.shift();
            });
            const clearOn = sinon.spy(x => x === 2);
            class Foo {
                @deco_memoize({ clearOn })
                async foo() {
                    return innerFn()
                }
            }

            let f = new Foo();
            let result = [
                await f.foo(),
                await f.foo(),
                await f.foo(),
                await f.foo(),
            ];
            deepEq_(result, [2, 1, 1, 1]);
            eq_(clearOn.callCount, 2);
            eq_(innerFn.callCount, 2);
            deepEq_(clearOn.args, [[2], [1]]);
        },
        async 'using sync flow'() {
            const arr = [2, 1, 2, 4, 2];
            const innerFn = sinon.spy(function (letter) {
                return arr.shift();
            });
            const clearOn = sinon.spy(x => x === 2);
            class Foo {
                @deco_memoize({ clearOn })
                foo() {
                    return innerFn()
                }
            }

            let f = new Foo();
            let result = [
                f.foo(),
                f.foo(),
                f.foo(),
                f.foo(),
            ];
            deepEq_(result, [2, 1, 1, 1]);
            eq_(clearOn.callCount, 2);
            eq_(innerFn.callCount, 2);
        }
    },
    async 'memoize only when active promise'() {
        let num = 1;

        const innerFn = sinon.spy(fn_memoize(async function (letter) {
            let x = ++num;
            await wait(500);
            return x;
        }, { clearOnReady: true }));

        let promise1 = innerFn();

        await wait(10);
        let promise2 = innerFn();

        await wait(600);
        let promise3 = innerFn();

        let result1 = await promise1;
        eq_(result1, 2);

        let result2 = await promise2;
        eq_(result2, 2);

        let result3 = await promise3;
        eq_(result3, 3);
    },

    'memoize on properties': {
        'for all instances' () {
            class Foo {
                @deco_memoize()
                get getFoo () {
                    return { t: Math.random() };
                }
            }
            let foo = new Foo ();
            let v1 = foo.getFoo;
            let v2 = foo.getFoo;
            eq_(typeof v1.t, 'number');
            eq_(v1.t, v2.t);

            let foo2 = new Foo()
            let v21 = foo2.getFoo;
            eq_(v1.t, v21.t);
        },
        'per instance' () {
            class Foo {
                @deco_memoize({ perInstance: true })
                get getFoo () {
                    return { t: Math.random() };
                }
            }
            let foo = new Foo ();
            let v1 = foo.getFoo;
            let v2 = foo.getFoo;
            eq_(typeof v1.t, 'number');
            eq_(v1.t, v2.t);

            let foo2 = new Foo()
            let v21 = foo2.getFoo;
            let v22 = foo2.getFoo;
            eq_(typeof v21.t, 'number');
            eq_(v21.t, v22.t);

            notEq_(v1.t, v21.t);
        }
    },
    'should set this argument for memoized function' () {
        const spied = Sinon.spy(function () {
            return this?.foo;
        });
        const foo = {
            foo: 'ifoo',
            getFoo: spied
        };
        const getFooMemoized = fn_memoize(foo.getFoo, {
            thisArg: foo
        });

        eq_(getFooMemoized(), 'ifoo');
        eq_(getFooMemoized(), 'ifoo');
        eq_(spied.callCount, 1);

        const getFooMemoizedWrong = fn_memoize(foo.getFoo);
        eq_(getFooMemoizedWrong(), null);
    }
})

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}
