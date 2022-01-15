import * as Sinon from 'sinon';
import { deco_memoize } from '../src/deco/memoize';
import { IStore } from '../src/persistance/IStore'

UTest({
    async 'should memoize values async' () {

        class Mem implements IStore {
            mem = {};
            async getAsync (key) {
                return this.mem[key];
            }
            async saveAsync (key, val) {
                this.mem[key] = val;
            }
        }


        let db = new Mem;
        let mult = Sinon.spy((a, b) => a * b);
        class Foo {

            @deco_memoize({ store: db })
            multAsync (num: number) {
                return mult(num, 2);
            }
        }

        let foo = new Foo ();
        let val = await foo.multAsync(2);
        eq_(val, 4);
        eq_(db.mem[2].value, 4);
        eq_(mult.callCount, 1);

        let valRepeat = await foo.multAsync(2);
        eq_(valRepeat, 4);
        eq_(mult.callCount, 1);
    },

    'should memoize values sync' () {

        class Mem implements IStore {

            mem = {};
            get  (key) {
                return this.mem[key];
            }
            save  (key, val) {
                this.mem[key] = val;
            }
        }

        let db = new Mem;
        let mult = Sinon.spy((a, b) => a * b);
        class Foo {

            @deco_memoize({ store: db })
            mult (num: number) {
                return mult(num, 2);
            }
        }

        let foo = new Foo ();
        let val = foo.mult(2);
        eq_(val, 4);
        eq_(db.mem[2].value, 4);
        eq_(mult.callCount, 1);

        let valRepeat = foo.mult(2);
        eq_(valRepeat, 4);
        eq_(mult.callCount, 1);
    },

    async 'from store only' () {
        class Mem implements IStore {
            async getAsync (key, num) {
                return { value: num * 3 };
            }
            async saveAsync (key, val) {
                throw new Error('Shouldnt save')
            }
        }


        let db = new Mem;
        let mult = Sinon.spy((a, b) => a * b);
        class Foo {

            @deco_memoize({ store: db })
            multAsync (num: number) {
                return mult(num, 2);
            }
        }

        let foo = new Foo ();
        let val = await foo.multAsync(2);
        eq_(val, 6);
        eq_(mult.callCount, 0);

    }

})
