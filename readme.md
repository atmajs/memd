<h1><code>Mem</code><tt>d</tt></h1>
----

[![Build Status](https://travis-ci.org/atmajs/Ruta.png?branch=master)](https://travis-ci.org/tenbits/memd)
[![NPM version](https://badge.fury.io/js/memd.svg)](http://badge.fury.io/js/memd)
[![Bower version](https://badge.fury.io/bo/memd.svg)](http://badge.fury.io/bo/memd)


Object Cache. Memoize, debounce, throttle and queue methods.

```typescript

import { deco } from 'memd';

class Foo {
    @deco.memoize() 
    foo () {}

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

----
_Atma.js Project_
