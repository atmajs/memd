export interface IMemoizeWrapper<T extends Function> {
    (fn: T): T
    clearArgs(...args)
    clearAll()
}