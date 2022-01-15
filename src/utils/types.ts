
export type Methods<T> = {
    [P in keyof T]: T[P] extends (...args) => any ? T[P] : never;
};
