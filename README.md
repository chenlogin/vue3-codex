# vue3-codex

- 1、reactive.md，proxy实现最基本的响应式系统
- 2、reactivePlus.md，优化响应式系统
- 3、asynUpdate.md 异步更新
- 4、computed.md 计算属性
- 5、watch.md
- 6、nextTick.md

## Set
Set 是 JavaScript 中的一个内置对象，它允许你存储任何类型的唯一值
```
const fruits = new Set(['apple', 'banana', 'orange']);
 
// 添加元素
// Set对象中的元素是唯一的。
// 如果尝试向Set中添加一个已经存在的元素，该操作不会有任何效果，即不会改变Set的内容。
fruits.add('grape’);
//mySet.add(1);
//mySet.add('hello');
//mySet.add({ name: 'Alice' });
 
// 检查元素
console.log(fruits.has('banana')); // 输出: true
console.log(fruits.has('mango')); // 输出: false
 
// 删除元素
fruits.delete('orange');
 
// 获取大小
console.log(fruits.size); // 输出: 3
 
// 遍历 Set
for (let fruit of fruits) {
  console.log(fruit);
}
 
// 转换为数组
const fruitArray = [...fruits];
console.log(fruitArray); // 输出: ['apple', 'banana', 'grape']
```

## Proxy
Proxy 是 JavaScript 中的一个内置对象，用于创建对象的代理，以定义其基本操作的自定义行为
```
// get(target, property, receiver): 拦截属性读取操作。
// set(target, property, value, receiver): 拦截属性设置操作。
// has(target, prop): 拦截 in 操作符。
// deleteProperty(target, prop): 拦截 delete 操作符。
// apply(target, thisArg, argumentsList): 拦截函数调用。
// construct(target, argumentsList, newTarget): 拦截 new 操作符。
// getOwnPropertyDescriptor(target, prop): 获取目标对象的属性描述符。
// defineProperty(target, prop, descriptor): 定义或修改目标对象的属性。
// enumerate(target): 拦截 for...in 循环、Object.keys、Object.getOwnPropertyNames、Object.getOwnPropertySymbols 和 Reflect.ownKeys。
// ownKeys(target): 拦截上述方法以返回目标对象的属性键。
// preventExtensions(target): 拦截 Object.preventExtensions。
// getPrototypeOf(target): 拦截 Object.getPrototypeOf。
// setPrototypeOf(target, prototype): 拦截 Object.setPrototypeOf。
// isExtensible(target): 拦截 Object.isExtensible。

const targetObject = {
  name: 'Alice',
  age: 25
};
 
const handlerObject = {
  get(target, property) {
    console.log(`Getting ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true; // 表示设置成功
  }
};
 
const proxyObject = new Proxy(targetObject, handlerObject);
 
console.log(proxyObject.name); // 输出: Getting name, 然后输出: Alice
 
proxyObject.age = 30; // 输出: Setting age to 30
 
console.log(targetObject.age); // 输出: 30，因为目标对象也被更新了
```

## WeakMap
WeakMap 是一种特殊的键值对存储结构，适用于存储与对象关联的元数据或私有数据。它的主要特点是：
- 键必须是对象。
- 对键的引用是弱引用，不会阻止垃圾回收。
- 不可枚举，WeakMap 没有方法可以遍历其键或值（如 keys()、values()、entries()），也没有 size 属性。
