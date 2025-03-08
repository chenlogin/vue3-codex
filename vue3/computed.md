```
import { reactive, computed } from 'vue'

const state = reactive({
  a: 1,
  b: 2,
  c: 3,
})
const sum = computed(() => {
  return state.a + state.b
})
```
computed最耀眼的几个特性
1. 依赖追踪，只有state.a和state.b发生变化的时候，sum才会重新计算
2. 缓存，如果state.a和state.b值改变，那么我们读取sum的时候，它将会返回上一次计算的结果，而不是重新计算
3. 懒计算，计算属性真正被使用（读取）的时候才会进行计算

### 懒计算
- 添加一个额外的参数lazy，如果传递了lazy为true，副作用函数将不会立即执行，而是将执行的时机交还给用户，由用户决定啥时候执行。
```
const effect = function (fn, options = {}) {
  const effectFn = () => {
    // ... 省略
    // 新增res存储fn执行的结果
    const res = fn()
    // ... 省略
    // 新增返回结果
    return res
  }
  // ... 省略
  // 新增，只有lazy不为true时才会立即执行
  if (!options.lazy) {
    effectFn()
  }
  // 新增，返回副作用函数让用户执行
  return effectFn
}
```
封装computed
```
function computed (getter) {
  const effectFn = effect(getter, {
    lazy: true,
  })

  const obj = {
    get value () {
      return effectFn()
    }
  }

  return obj
}
```
### 缓存
缓存上一次计算的结果，咱们需要定义一个value变量
```
function computed (getter) {
  const effectFn = effect(getter, {
    lazy: true,
  })
  let value
  let dirty = true

  const obj = {
    get value () {
      // 2. 只有数据发生变化了才去重新计算
      if (dirty) {
        value = effectFn()
        dirty = false
      }

      return value
    }
  }

  return obj
}
```
寄上任务调度
```
function computed (getter) {
  const effectFn = effect(getter, {
    lazy: true,
    // 数据发生变化后，不执行注册的回调，而是执行scheduler
    scheduler () {
      // 数据发生了变化后，则重新设置为dirty，那么下次就会重新计算
      dirty = true
    }
  })
  let value
  let dirty = true

  const obj = {
    get value () {
      // 2. 只有数据发生变化了才去重新计算
      if (dirty) {
        value = effectFn()
        dirty = false
      }

      return value
    }
  }

  return obj
}
```