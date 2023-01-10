export namespace Args {
    type ICtx = {
        level: number
        refs: any[]
    };
    type IKeyOptions = {
        deep?: number
        serialize?: {
            [selector: string]: (val: any) => string
        }
    }

    export function getKey(args: any[], keyOptions?: IKeyOptions, selector?: string, ctx?: ICtx ) {
        if (ctx == null) {
            ctx = { level: 0, refs: [] };
        }
        if (keyOptions == null) {
            keyOptions = {}
        }
        if (keyOptions.deep == null) {
            keyOptions.deep = 3;
        }
        if (selector == null) {
            selector = '';
        }

        let key = '';
        for (let i = 0; i < args.length; i++) {
            if (i > 0) {
                key += '.';
            }
            ctx.level++;
            key += getKeySingle(args[i], `${selector}.${i}`, keyOptions, ctx);
            ctx.level--;
        }
        return key;
    }



    function getKeySingle (misc: any, selector: string, keyOptions: IKeyOptions, ctx: ICtx) {

        if (keyOptions.deep != null && ctx.level > keyOptions.deep) {
            return '';
        }
        if (keyOptions.serialize != null && keyOptions.serialize[selector.substring(1) /* cut trailing '.'*/] != null) {
            return keyOptions.serialize[ selector.substring(1) ] (misc);
        }
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
            return getKey(misc, keyOptions, selector, ctx);
        }
        let str = '';
        for (let key in misc) {
            ctx.level++;
            str += '.' + getKeySingle(misc[key], `${selector}.${key}`, keyOptions, ctx);
            ctx.level--;
        }
        return str;
    }
}
