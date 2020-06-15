export namespace Args {
    export function getKey(args: any[]) {
        let key = '';
        for (let i = 0; i < args.length; i++) {
            key += '.' + getKeySingle(args[i]);
        }
        return key;
    }
    function getKeySingle (misc: any) {
        if (misc == null) {
            return '';
        }
        if (typeof misc !== 'object') {
            return misc;
        }
        if (misc instanceof Date) {
            return misc.getTime();
        }
        if (misc instanceof Array) {
            return getKey(misc);
        }
        let str = '';
        for (let key in misc) {
            str += '.' + getKeySingle(misc[key]);
        }
        return str;
    }
}
