export namespace Args {
    export function getKey(args: any[]) {
        let key = '';
        for (let i = 0; i < args.length; i++) {
            key += '.' + getKeySingle(args[i]);
        }
        return key;
    }
    function getKeySingle (x: any) {
        if (typeof x !== 'object') {
            return x;
        }
        let str = '';
        for (let key in x) {
            str += '.' + getKeySingle(x[key]);
        }
        return str;
    }
}
