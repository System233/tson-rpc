import { TSON, TSONData } from "tson-serializer";
import { BiMap } from "./bimap";
export declare type TypeOf = "array" | "object" | "function" | null;
export declare class Handler implements ProxyHandler<any> {
    apply(target: Function, thisArg: any, argArray: any[]): any;
    construct(target: any, argArray: any[], newTarget: Function): object;
    defineProperty(target: any, p: string | symbol, attributes: PropertyDescriptor): boolean;
    deleteProperty(target: any, p: string | symbol): boolean;
    get(target: any, p: string | symbol, receiver: any): any;
    getOwnPropertyDescriptor(target: any, p: string | symbol): PropertyDescriptor | undefined;
    getPrototypeOf(target: any): object | null;
    has(target: any, p: string | symbol): boolean;
    isExtensible(target: any): boolean;
    ownKeys(target: any): ArrayLike<string | symbol>;
    preventExtensions(target: any): boolean;
    set(target: any, p: string | symbol, value: any, receiver: any): boolean;
    setPrototypeOf(target: any, v: object | null): boolean;
}
export interface WrappedObjectData {
    id: string;
    type: TypeOf;
}
export declare type ParametersSkipFirst<T extends (first: any, ...args: any) => any> = T extends (first: any, ...args: infer P) => any ? P : never;
export declare class WrappedObject<T extends object> implements ProxyHandler<T> {
    handler: WrappedHandler;
    data: WrappedObjectData;
    constructor(handler: WrappedHandler, data: WrappedObjectData);
    call<T extends keyof Handler>(method: T, args: ParametersSkipFirst<Handler[T]>): ReturnType<Handler[T]>;
    get(target: any, p: keyof Handler, receiver: any): any;
    has(target: any, p: string | symbol): boolean;
}
export interface WrappedRequest {
    target: WrappedObjectData;
    method: keyof Handler;
    data: TSONData[];
}
export declare type RequestHandler = (request: WrappedRequest) => TSONData | TSONData[];
export declare const typeOf: (value: any) => TypeOf;
export declare class WrappedHandler {
    request: RequestHandler;
    map: BiMap<string, object>;
    tson: TSON;
    handler: Handler;
    constructor(request: RequestHandler);
    id(value: object): string;
    dump(obj: object): WrappedObjectData;
    load<T extends object>(data: WrappedObjectData): T;
    new(value: object, id?: string): string;
    join(value: object, id?: string): WrappedObjectData;
    local(id: string): WrappedObjectData;
    remote<T extends object>(data: WrappedObjectData): T;
    call<T extends keyof Handler>(target: WrappedObjectData, method: T, params: ParametersSkipFirst<Handler[T]>): ReturnType<Handler[T]>;
    handle<T extends keyof Handler>(request: WrappedRequest): TSONData<any, any>;
    delete(id: string): boolean;
    get(id: string): object;
}
