<!--
 Copyright (c) 2022 System233
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# TSON-RPC
Connect objects anywhere in pairs like quantum entanglement.

🧪 Experimental Technology.
❌ DO NOT USE IF YOU DON'T KNOW WHAT YOU'RE DOING. 
❗It may expose your system to danger or attack.

## Example

```ts


class Test{
    constructor(public name:string){}
    call(obj:Test,...args:any){
        console.log(this.name,'call()',obj, args);
        obj.print(args)
    }

    print(args:[]){
        console.log(this.name,'print', args);
        console.log(this.name,'print length', args.length);
        console.log(this.name,'print', args.map(x=>`${x}!`));
    }
    push(array:any[]){
        console.log(this.name,'push() before',array)
        array.push('pushed data');
        console.log(this.name,'push() after',array)
        console.log(this.name,'set',array)
        console.log(this.name,'set length',array.length)
        console.log(this.name,'set iter..',[...array])
        console.log(this.name,'set iter',array[Symbol.iterator])
    }
};
let client:WrappedHandler;

const test=new Test("[Remote]");

const erase=(data:any)=>JSON.parse(JSON.stringify(data));

const server=new WrappedHandler(req=>client.handle(erase(req)));
const id=server.new(test);



client=new WrappedHandler(req=>server.handle(erase(req)));
const remote=client.remote<Test>({id,type:typeOf(test)});


const localArray:string[]=[];

const local=new Test("[Local]");
remote.call(local,"local string");
remote.push(localArray);
console.log('localArray',localArray)

// [Remote] call() {} [ 'local string' ]
// [Local] print []
// [Local] print length 1
// [Local] print []
// [Remote] push() before []
// [Remote] push() after [] <--You can't see the remote object.
// [Remote] set []
// [Remote] set length 1
// [Remote] set iter.. [ 'pushed data' ]
// [Remote] set iter [Function (anonymous)]
// localArray [ 'pushed data' ]
```