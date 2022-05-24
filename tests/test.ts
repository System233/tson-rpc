// Copyright (c) 2022 System233
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { typeOf, WrappedHandler } from "..";


class Test{
    constructor(public name:string){}
    call(obj:Test,...args:any){
        console.log(this.name,'call()',obj, args);
        obj.print(args)
    }
    log(...args){
        console.log(this.name,...args);
    }
    print(args:[]){
        this.log('print', args);
        this.log('print length', args.length);
        this.log('print', args.map(x=>`${x}!`));
    }
    push(array:any[]){
        this.log('push() before',array)
        array.push('pushed data');
        this.log('push() after',array)
        this.log('set',array)
        this.log('set length',array.length)
        this.log('set iter..',[...array])
        this.log('set iter',array[Symbol.iterator])
    }
    buffer(buffer:ArrayBuffer){
        this.log('buffer',buffer)
        this.log('new buffer',new Uint8Array(buffer))
    }
};
let client:WrappedHandler;

const test=new Test("[Remote]");

const erase=(data:any)=>JSON.parse(JSON.stringify(data));

const server=new WrappedHandler(req=>client.handle(erase(req)));
const remoteId=server.join(test);



client=new WrappedHandler(req=>server.handle(erase(req)));
const remote=client.remote<Test>(remoteId);


const localArray:string[]=[];

const local=new Test("[Local]");
remote.call(local,"local string");
remote.push(localArray);
console.log('localArray',localArray)
const localBuffer=new ArrayBuffer(10);
remote.buffer(localBuffer);
const proxy=new Proxy(localBuffer,{});
console.log('typeof',typeof proxy);
console.log('instanceof',proxy instanceof ArrayBuffer );
const test2=new Uint8Array(proxy)
console.log('test2',test2);