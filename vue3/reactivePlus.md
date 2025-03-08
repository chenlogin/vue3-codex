1、当把ok的值改成false后，页面将渲染为"not"。意味着后续无论text如何变化，页面都永远只可能是"not"。
所以当我们修改text的值时，副作用函数重新执行是没有必要的。
```
const state = reactive({
  ok: true,
  text: 'hello world',
});

effect(() => {
  console.log('渲染执行')
  document.querySelector('#app').innerHTML = state.ok ? state.text : 'not'
})
```
在副作用函数执行前先将其从与该副作用函数有关的依赖集合中删除
```
const effect = function (fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  // 用来存储哪些依赖集合包含这个副作用函数
  effectFn.deps = []
  effectFn()
}

function cleanup (effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}
```
```
// trigger执行依赖
function trigger(target, key) {
  // 读取depsMap 其结构是 key => effects
  const depsMap = bucket.get(target);

  if (!depsMap) {
    return;
  }
  // 真正读取依赖当前属性值key的effects
  const effects = depsMap.get(key);
  // 解决cleanup 执行会无限执行的问题
  const effectsToRun = new Set(effects)
  // 挨个执行即可
  effectsToRun.forEach((fn) => fn());
}
```
2、effect嵌套
```
const state = reactive({
  foo: true,
  bar: true
})

effect(function effectFn1 () {
  console.log('effectFn1')

  effect(function effectFn2 () {
    console.log('effectFn2')
    console.log('Bar', state.bar)
  })
  
  console.log('Foo', state.foo)
})
```
当effectFn1开始执行的时，activeEffect指向的是effectFn1。而effectFn1的执行会间接地导致effectFn2的执行，此时activeEffect指向的是effectFn2
当effectFn2执行完毕时，因为activeEffect指向的是effectFn2。所以foo自然也就是和effectFn2建立了联系，而不是我们期待的effectFn1。
要解决这个问题，我们新维护一个注册副作用函数的栈，让activeEffect指向的是永远是栈顶的副作用函数
```
const bucket = new WeakMap();
const effectStack = []
// 重新定义bucket数据类型为WeakMap
let activeEffect;
const effect = function (fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    // 入栈
    effectStack.push(effectFn)
    fn()
    // 出栈
    effectStack.pop()
    activeEffect = effectStack[ effectStack.length - 1 ]
  }
  // 用来存储哪些依赖集合包含这个副作用函数
  effectFn.deps = []
  effectFn()
  console.log(effectStack.length, '---')
  // 非常重要
  // activeEffect = null
};
```