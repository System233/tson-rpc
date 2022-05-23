// Copyright (c) 2022 System233
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


export class BiMap<K,T>{
    map:Map<K,T>=new Map;
    imap:Map<T,K>=new Map;
    constructor(pairs?:[K,T][]){
        if(pairs!=null){
            pairs.forEach(([key,value])=>this.set(key,value));
        }
    }
    has(key:K){
        return this.hasKey(key);
    }
    hasKey(key:K){
        return this.map.has(key);
    }
    hasValue(value:T){
        return this.imap.has(value);
    }
    get(key:K):T{
        return this.getByKey(key);
    }
    getByKey(key:K):T{
        return this.map.get(key) as T;
    }
    getByValue(value:T):K{
        return this.imap.get(value) as K;
    }
    set(key:K,value:T){
        this.map.set(key,value);
        this.imap.set(value,key);
    }
    delete(key:K){
        return this.deleteKey(key);
    }
    deleteBoth(key:K,value:T){
        if(this.hasKey(key)&&this.hasValue(value)){
            return this.map.delete(key)&&this.imap.delete(value);
        }
        return true;
    }
    deleteKey(key:K){
        return this.deleteBoth(key,this.getByKey(key));
    }
    deleteValue(value:T){
        return this.deleteBoth(this.getByValue(value),value);
    }
    clear(){
        this.map.clear();
        this.imap.clear();
    }
    forEach(callbackfn: (value: T, key: K, map: Map<K, T>) => void, thisArg?: any){
        return this.map.forEach(callbackfn,thisArg);
    }
    entries(){
        return this.map.entries();
    }
    keys(){
        return this.map.keys();
    }
    values(){
        return this.map.values();
    }
    get size(){
        return this.map.size;
    }
};