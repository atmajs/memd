import { ICacheEntryCollection } from '../Cache';

export interface ITransport <T = any> {
    isAsync: boolean
    debounceMs?: number

    restore? (): ICacheEntryCollection<T>
    restoreAsync? (): Promise<ICacheEntryCollection<T>>

    flush? (data: ICacheEntryCollection<T>)
    flushAsync? (data: ICacheEntryCollection<T>)
}