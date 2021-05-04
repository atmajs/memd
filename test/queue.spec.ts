import { deco_queued } from '../src/deco/queued'

UTest({
    async 'queue' () {

        class Foo {
            logs = [];

            @deco_queued()
            async log (timeout: number, val: string) {
                this.logs.push(val);
                await wait(timeout);
                this.logs.push(val);
            }
        }

        let foo = new Foo();
        let p1 = foo.log(100, '1');
        let p2 = foo.log(10, '2');
        let p3 = foo.log(1, '3');
        await p3;

        deepEq_(foo.logs, [
            '1', '1',
            '2', '2',
            '3', '3',
        ]);
    },
    async 'trim queue' () {

        class Foo {
            logs = [];

            @deco_queued({ trimQueue: true })
            async log (timeout: number, val: string) {
                this.logs.push(val);
                await wait(timeout);
                this.logs.push(val);
            }
        }

        let foo = new Foo();
        let p1 = foo.log(100, '1');
        let p2 = foo.log(10, '2');
        let p3 = foo.log(1, '3');
        await p3;

        deepEq_(foo.logs, [
            '1', '1',
            '3', '3',
        ]);
    },
    async 'throttle queue' () {


        class Foo {
            logs = [] as { timestamp: number, val: string }[];

            @deco_queued({ throttle: 300 })
            async log (val: string) {

                this.logs.push({
                    timestamp: Date.now(),
                    val: val
                });
                await wait(1);
            }
        }

        let foo = new Foo();

        let started = Date.now();
        let p1 = foo.log('1');
        let p2 = foo.log('2');
        let p3 = foo.log('3');

        await p3;
        let diffs = foo.logs.map((x, i) => {
            return x.timestamp - foo.logs[i - 1]?.timestamp
        }).slice(1);


        eq_(diffs.length, 2);
        gt_(diffs[0], 300);
        gt_(diffs[1], 300);

        deepEq_(foo.logs.map(x => x.val), ['1', '2', '3']);
    }
})



async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}
