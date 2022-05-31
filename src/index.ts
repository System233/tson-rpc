// Copyright (c) 2022 System233
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { TSON, TSONData } from "tson-serializer";
import { v4 as uuidv4 } from 'uuid'
import { BiMap } from "./bimap";

export type TypeOf = "array" | "object" | "function" | null;

export class Handler implements ProxyHandler<any>{

    apply(target: Function, thisArg: any, argArray: any[]): any {
        return target.apply(thisArg, argArray);
    }
    construct(target: any, argArray: any[], newTarget: Function): object {
        return new target(...argArray);
    }
    defineProperty(target: any, p: string | symbol, attributes: PropertyDescriptor): boolean {
        Object.defineProperty(target, p, attributes);
        return true;
    }
    deleteProperty(target: any, p: string | symbol): boolean {
        return delete target[p];
    }
    get(target: any, p: string | symbol, receiver: any): any {
        return target[p];
    }
    getOwnPropertyDescriptor(target: any, p: string | symbol): PropertyDescriptor | undefined {
        return Object.getOwnPropertyDescriptor(target, p);
    }
    getPrototypeOf(target: any): object | null {
        return Object.getPrototypeOf(target);
    }
    has(target: any, p: string | symbol): boolean {
        return p in target;
    }
    isExtensible(target: any): boolean {
        return Object.isExtensible(target);
    }
    ownKeys(target: any): ArrayLike<string | symbol> {
        return Object.keys(target);
    }
    preventExtensions(target: any): boolean {
        return Object.isFrozen(target);
    }
    set(target: any, p: string | symbol, value: any, receiver: any): boolean {
        target[p] = value;
        return true;
    }
    setPrototypeOf(target: any, v: object | null): boolean {
        Object.setPrototypeOf(target, v);
        return true;
    }
};
export interface WrappedObjectData {
    id: string;
    type: TypeOf;
}

export type ParametersSkipFirst<T extends (first: any, ...args: any) => any> = T extends (first: any, ...args: infer P) => any ? P : never;
export class WrappedObject<T extends object> implements ProxyHandler<T>{
    constructor(public handler: WrappedHandler, public data: WrappedObjectData) {
        const target = data.type == 'function' ? function () { } : data.type == 'array' ? [] : {};
        return new Proxy(target as any, new Proxy({}, this));
    }
    call<T extends keyof Handler>(method: T, args: ParametersSkipFirst<Handler[T]>): ReturnType<Handler[T]> {
        return this.handler.call(this.data, method, args);
    }
    get(target: any, p: keyof Handler, receiver: any) {
        if (p in target) {
            return target[p];
        }
        const handler = (_: any, ...args: any) => this.call(p, args);
        target[p] = handler;
        return handler;
    }
    has(target: any, p: string | symbol): boolean {
        return p in target;
    }
}
export interface WrappedRequest{
    target: WrappedObjectData;
    method: keyof Handler;
    data: TSONData[]
}
export type RequestHandler = (request:WrappedRequest) => TSONData | TSONData[];
export const typeOf = (value: any): TypeOf => value != null&& !(value instanceof ArrayBuffer) ? Array.isArray(value) ? 'array' : typeof value == 'object' ? 'object' : typeof value == 'function' ? 'function' : null : null;
export class WrappedHandler {
    map: BiMap<string, object> = new BiMap;
    tson: TSON = new TSON;
    handler: Handler = new Handler;
    constructor(public request: RequestHandler) {
        this.tson.register<object, WrappedObjectData>('Wrapped',
            (data) => this.load(data),
            (obj) => this.dump(obj),
            (value: any) => !!typeOf(value)
        );
    }
    id(value: object) {
        if (this.map.hasValue(value)) {
            return this.map.getByValue(value);
        }
        return this.new(value);
    }
    dump(obj: object): WrappedObjectData {
        const type = typeOf(obj);
        let id = this.map.getByValue(obj);
        if (id == null) {
            id = uuidv4();
            this.map.set(id, obj);
        }
        return {
            id,
            type
        };
    }
    load<T extends object>(data: WrappedObjectData): T {
        if (this.map.has(data.id)) {
            return this.map.get(data.id) as T;
        }
        return this.remote<T>(data);
    }
    new(value: object, id?: string): string {
        id = id || uuidv4();
        this.map.set(id, value);
        return id;
    }
    join(value: object, id?: string):WrappedObjectData{
        const type=typeOf(value);
        id=this.new(value,id);
        return {
            id,
            type
        }
    }
    remote<T extends object>(data: WrappedObjectData): T {
        const obj = new WrappedObject<T>(this, data) as T;
        this.new(obj, data.id);
        return obj;
    }
    call<T extends keyof Handler>(target: WrappedObjectData, method: T, params: ParametersSkipFirst<Handler[T]>): ReturnType<Handler[T]> {
        const data = params.map(x => this.tson.forward(x));
        const result = this.request({target, method, data});
        return this.tson.backward(result);
    }
    handle<T extends keyof Handler>(request:WrappedRequest) {
        const {target,method,data}=request;
        const args = this.tson.backward<ParametersSkipFirst<Handler[T]>>(data);
        const result = (this.handler[method] as any).call(this.handler, this.load(target), ...args);
        return this.tson.forward(result);
    }
    delete(id: string) {
        return this.map.delete(id);
    }
    get(id:string){
        return this.map.getByKey(id);
    }
}
