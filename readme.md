# Memd

<p align='center'>
    <img src='assets/background.jpg'/>
</p>

----

[![Build Status](https://travis-ci.com/atmajs/memd.png?branch=master)](https://travis-ci.com/atmajs/memd)
[![NPM version](https://badge.fury.io/js/memd.svg)](http://badge.fury.io/js/memd)

* Memoize, debounce, throttle and queue methods
* Cache Handler
* Persistence: (File, LocalStorage, Custom)
* NodeJS/Browser

```ts

import { deco } from 'memd';

class Foo {
    @deco.memoize()
    someMethod () {}

    @deco.memoize()
    get someProp () {}

    @deco.debounce()
    bar () {}

    @deco.throttle()
    qux () {}

    @deco.queue()
    async dex () {}
}
```

### `Cache`

```ts
import { Cache } from 'memd'

interface ICacheOpts {
    maxAge?: number
    monitors?: ICacheChangeEventMonitor[]
    keyResolver?: (...args) => string
}
interface ICacheChangeEventMonitor {
    on (event: 'change', fn: Function)
    off (event: 'change', fn: Function)
}

const cache = new Cache(<ICacheOpts> { maxAge: 60 });
```
```ts
.get (key: string): T
.set (key: string, val: T): T
.clear (key?: string)
.destroy ()

```

### `memoize`

```ts
interface IMemoizeOpts {
    // Per default method or getter returns are cached for all instances of a class.
    // Use `perInstance` to cache per instance: this could be useful when the method reads `this.` values.
    perInstance?: boolean

    // When a promise is memoized, and gets rejected. Clear also the cache, so that
    // the next time it wont hit the cache and is reavaluated.
    clearOnReject?: boolean
}
.memoize(opts?: ICacheOpts & IMemoizeOpts)
```

### `debounce`

When `ms` is `0` or `undefined` then `requestAnimationFrame` or `setImmediate` is used.

```ts
.debounce(ms: number = 0)
```

### `throttle`

```ts
.throttle(ms: number, shouldCallLater?: boolean)
```

### `queued`

Calls method only when the previous promise is resolved. Use `trimQueue: true` to ensure the queue consists of max 1 listener.

```ts
.queued(opts: { trimQueue?: boolean, timeout?: number, throttle?: number })
```


## Transport and Store for Cache/Memoize

### Transport

Persist all cached data to the backed store, to be able to restore on app restarts
##### (`NodeJS`) Files

```js
import memd from 'memd'
const fs = new memd.FsTransport({ path: './lorem.json' });
class Foo {

    @memd.deco.memoize({ transport: fs })
    foo (bar) {
        // do smth
    }
}
```

##### (`Browser`) localStorage

```js
import memd from 'memd'

const storage = new memd.LocalStorageTransport({ key: 'foo' });
class Foo {

    @memd.deco.memoize({ transport: storage })
    foo (bar) {
        // do smth
    }
}
```


### Store

Read and Save single values from store

```js
import memd from 'memd'

const store = {
    getAsync (key: string, ...args) {
        // get cached value if any
        return {
            value: 'bar'
        }
    },
    saveAsync (key: string, entry: { value: any, timestamp: number }) {
        // save cached value
    }
}
class Foo {

    @memd.deco.memoize({ store })
    foo (bar) {
        // do smth
    }
}
```

----
_Atma.js Project_

