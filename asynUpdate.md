批量更新或者叫异步更新
- 调度执行
  - 指的是响应式数据发生变化出发副作用函数重新执行时，我们有能力去决定副作用函数的执行时机、次数和方式。

通过scheduler来自主控制副作用函数的执行时机
```
// 增加options参数
const effect = function (fn, options = {}) {
  const effectFn = () => {
   // ....
  }
  // ...
  // 将options参数挂在effectFn上，便于effectFn执行时可以读取到scheduler
  effectFn.options = options
}

function trigger(target, key) {
// ...

  effectsToRun.forEach((effectFn) => {
    // 当指定了scheduler时，将执行scheduler而不是注册的副作用函数effectFn
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}
```
对于页面渲染来说1到101中间的2~100仅仅只是过程，并不是最终的结果，处于性能考虑Vue只会渲染最后一次的101
```
const state = reactive({
  num: 1
})

effect(() => {
  console.log('num', state.num)
})

let count = 100

while (count--) {
  state.num++
}
```
利用可调度性，再加点事件循环
  - 1、num的每次变化都会导致scheduler的执行，并将注册好的副作用函数存入jobQueue队列，因为Set本身的去重性质，最终只会存在一个fn
  - 2、利用Promise微任务的特性，当num被更改100次之后同步代码全部执行结束后，then回调将会被执行，此时num已经是101，而jobQueue中也只有一个fn，所以最终只会打印一次101
```
const state = reactive({
  num: 1
})

const jobQueue = new Set()
const p = Promise.resolve()
let isFlushing = false

const flushJob = () => {
  if (isFlushing) {
    return
  }

  isFlushing = true
  // 微任务
  p.then(() => {
    jobQueue.forEach((job) => job())
  }).finally(() => {
    // 结束后充值设置为false
    isFlushing = false
  })
}

effect(() => {
  console.log('num', state.num)
}, {
  scheduler (fn) {
    // 每次数据发生变化都往队列中添加副作用函数，因为Set本身的去重性质，最终只会存在一个fn
    jobQueue.add(fn)
    // 并尝试刷新job，但是一个微任务只会在事件循环中执行一次，所以哪怕num变化了100次，最后也只会执行一次副作用函数
    flushJob()
  }
})

let count = 100

while (count--) {
  state.num++
}
```