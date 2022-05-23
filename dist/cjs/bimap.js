"use strict";
// Copyright (c) 2022 System233
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiMap = void 0;
class BiMap {
    map = new Map;
    imap = new Map;
    constructor(pairs) {
        if (pairs != null) {
            pairs.forEach(([key, value]) => this.set(key, value));
        }
    }
    has(key) {
        return this.hasKey(key);
    }
    hasKey(key) {
        return this.map.has(key);
    }
    hasValue(value) {
        return this.imap.has(value);
    }
    get(key) {
        return this.getByKey(key);
    }
    getByKey(key) {
        return this.map.get(key);
    }
    getByValue(value) {
        return this.imap.get(value);
    }
    set(key, value) {
        this.map.set(key, value);
        this.imap.set(value, key);
    }
    delete(key) {
        return this.deleteKey(key);
    }
    deleteBoth(key, value) {
        if (this.hasKey(key) && this.hasValue(value)) {
            return this.map.delete(key) && this.imap.delete(value);
        }
        return true;
    }
    deleteKey(key) {
        return this.deleteBoth(key, this.getByKey(key));
    }
    deleteValue(value) {
        return this.deleteBoth(this.getByValue(value), value);
    }
    clear() {
        this.map.clear();
        this.imap.clear();
    }
    forEach(callbackfn, thisArg) {
        return this.map.forEach(callbackfn, thisArg);
    }
    entries() {
        return this.map.entries();
    }
    keys() {
        return this.map.keys();
    }
    values() {
        return this.map.values();
    }
    get size() {
        return this.map.size;
    }
}
exports.BiMap = BiMap;
;
