"use strict";
// Copyright (c) 2022 System233
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedHandler = exports.typeOf = exports.WrappedObject = exports.Handler = void 0;
const tson_serializer_1 = require("tson-serializer");
const uuid_1 = require("uuid");
const bimap_1 = require("./bimap");
class Handler {
    apply(target, thisArg, argArray) {
        return target.apply(thisArg, argArray);
    }
    construct(target, argArray, newTarget) {
        return new target(...argArray);
    }
    defineProperty(target, p, attributes) {
        Object.defineProperty(target, p, attributes);
        return true;
    }
    deleteProperty(target, p) {
        return delete target[p];
    }
    get(target, p, receiver) {
        return target[p];
    }
    getOwnPropertyDescriptor(target, p) {
        return Object.getOwnPropertyDescriptor(target, p);
    }
    getPrototypeOf(target) {
        return Object.getPrototypeOf(target);
    }
    has(target, p) {
        return p in target;
    }
    isExtensible(target) {
        return Object.isExtensible(target);
    }
    ownKeys(target) {
        return Object.keys(target);
    }
    preventExtensions(target) {
        return Object.isFrozen(target);
    }
    set(target, p, value, receiver) {
        target[p] = value;
        return true;
    }
    setPrototypeOf(target, v) {
        Object.setPrototypeOf(target, v);
        return true;
    }
}
exports.Handler = Handler;
;
class WrappedObject {
    handler;
    data;
    constructor(handler, data) {
        this.handler = handler;
        this.data = data;
        const target = data.type == 'function' ? function () { } : data.type == 'array' ? [] : {};
        return new Proxy(target, new Proxy({}, this));
    }
    call(method, args) {
        return this.handler.call(this.data, method, args);
    }
    get(target, p, receiver) {
        if (p in target) {
            return target[p];
        }
        const handler = (_, ...args) => this.call(p, args);
        target[p] = handler;
        return handler;
    }
    has(target, p) {
        return p in target;
    }
}
exports.WrappedObject = WrappedObject;
const typeOf = (value) => value != null && !(value instanceof ArrayBuffer) ? Array.isArray(value) ? 'array' : typeof value == 'object' ? 'object' : typeof value == 'function' ? 'function' : null : null;
exports.typeOf = typeOf;
class WrappedHandler {
    request;
    map = new bimap_1.BiMap;
    tson = new tson_serializer_1.TSON;
    handler = new Handler;
    constructor(request) {
        this.request = request;
        this.tson.register('Wrapped', (data) => this.load(data), (obj) => this.dump(obj), (value) => !!(0, exports.typeOf)(value));
    }
    id(value) {
        if (this.map.hasValue(value)) {
            return this.map.getByValue(value);
        }
        return this.new(value);
    }
    dump(obj) {
        const type = (0, exports.typeOf)(obj);
        let id = this.map.getByValue(obj);
        if (id == null) {
            id = (0, uuid_1.v4)();
            this.map.set(id, obj);
        }
        return {
            id,
            type
        };
    }
    load(data) {
        if (this.map.has(data.id)) {
            return this.map.get(data.id);
        }
        return this.remote(data);
    }
    new(value, id) {
        id = id || (0, uuid_1.v4)();
        this.map.set(id, value);
        return id;
    }
    join(value, id) {
        const type = (0, exports.typeOf)(value);
        id = this.new(value, id);
        return {
            id,
            type
        };
    }
    remote(data) {
        const obj = new WrappedObject(this, data);
        this.new(obj, data.id);
        return obj;
    }
    call(target, method, params) {
        const data = params.map(x => this.tson.forward(x));
        const result = this.request({ target, method, data });
        return this.tson.backward(result);
    }
    handle(request) {
        const { target, method, data } = request;
        const args = this.tson.backward(data);
        const result = this.handler[method].call(this.handler, this.load(target), ...args);
        return this.tson.forward(result);
    }
    delete(id) {
        return this.map.delete(id);
    }
    get(id) {
        return this.map.getByKey(id);
    }
}
exports.WrappedHandler = WrappedHandler;
