export declare class BiMap<K, T> {
    map: Map<K, T>;
    imap: Map<T, K>;
    constructor(pairs?: [K, T][]);
    has(key: K): boolean;
    hasKey(key: K): boolean;
    hasValue(value: T): boolean;
    get(key: K): T;
    getByKey(key: K): T;
    getByValue(value: T): K;
    set(key: K, value: T): void;
    delete(key: K): boolean;
    deleteBoth(key: K, value: T): boolean;
    deleteKey(key: K): boolean;
    deleteValue(value: T): boolean;
    clear(): void;
    forEach(callbackfn: (value: T, key: K, map: Map<K, T>) => void, thisArg?: any): void;
    entries(): IterableIterator<[K, T]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<T>;
    get size(): number;
}
