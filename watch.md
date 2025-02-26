### 通过函数回调监听数据
```
const state1 = reactive({
  name: 'Vue3',
  age: 100
})

watch(() => state1.age, () => {
  console.log('state1的age发生变化了', state1.age)
})

state1.age = 200

setTimeout(() => {
  state1.age = 300
}, 500)
```
### 直接监听一个响应式对象
```
const state1 = reactive({
  name: 'vue3',
  age: 100,
  children: {
    name: 'js',
    age: 10
  }
})

watch(state1, () => {
  console.log('state1发生变化了', state1)
})

state1.age = 200

setTimeout(() => {
  state1.children.age = 100
}, 500)
```
watch的底层实现非常简单，和computed一样都需要借助任务调度
- 支持回调函数
```
const watch = (source, cb) => {
  effect(source, {
    scheduler () {
      cb()
    },
  })
}

// 测试一波
const state = reactive({
  name: '前端胖头鱼',
})

watch(() => state.name, () => {
  console.log('state.name发生了变化', state.name)
})

state.name = '胖小鱼'
```
- 支持直接传递响应式对象
    - 需要手动遍历这个响应式对象使得它的任意属性发生变化我们都能感知到
```
const bfs = (obj, callback) => {
  const queue = [ obj ]

  while (queue.length) {
    const top = queue.shift()

    if (top && typeof top === 'object') {
      for (let key in top) {
        // 读取操作出发getter，完成依赖搜集
        queue.push(top[ key ])
      }
    } else {
      callback && callback(top)
    }
  }
}

const obj = {
  name: '前端胖头鱼',
  age: 100,
  obj2: {
    name: '胖小鱼',
    age: 10,
    obj3: {
      name: '胖小小鱼',
      age: 1,
    }
  },
}

bfs(obj, (value) => {
  console.log(value)
})
```
```
const watch = (source, cb) => {
  let getter
  // 处理传回调的方式
  if (typeof source === "function") {
    getter = source
  } else {
    // 封装成读取source对象的函数，触发任意一个属性的getter，进而搜集依赖
    getter = () => bfs(source)
  }

  const effectFn = effect(getter, {
    scheduler() {
      cb()
    }
  })
}

// 测试一波
const state = reactive({
  name: "js",
  age: 100,
  obj2: {
    name: "Vue3",
    age: 10,
  },
})

watch(state, () => {
  console.log("state发生变化了");
});
```
感知state.obj2.name = 'yyyy'
```
// 统一对外暴露响应式函数
function reactive(state) {
  return new Proxy(state, {
    get(target, key) {
      const value = target[key]
      // 搜集key的依赖
      // 如果value本身是一个对象，对象下的属性将不具有响应式
      track(target, key) 
      // 如果是对象，再使其也变成一个响应式数据
      if (typeof value === "object" && value !== null) {
        return reactive(value);
      }

      return value;
    },
    set(target, key, newValue) {
      // console.log(`set ${key}: ${newValue}`)
      // 设置属性值
      target[key] = newValue

      trigger(target, key)
    },
  })
}
```
### watch的新值、旧值、立即调用
```
const watch = (source, cb, options = {}) => {
  let getter
  let oldValue
  let newValue
  // 处理传回调的方式
  if (typeof source === "function") {
    getter = source
  } else {
    getter = () => bfs(source)
  }

  const job = () => {
    // 变化后获取新值
    newValue = effectFn()
    cb(newValue, oldValue)
    // 执行回调后将新值设置为旧值
    oldValue = newValue
  }

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      job()
    }
  })
  // 如果指定了立即执行，便执行第一次
  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}


watch(() => state.name, (newValue, oldValue) => {
  console.log("state.name", { newValue, oldValue });
}, { immediate: true });
```