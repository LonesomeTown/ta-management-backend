export type PartialExcept<T, K extends keyof T>
    = Partial<T> & Record<K, T[K]>;