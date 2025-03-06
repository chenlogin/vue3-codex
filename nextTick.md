## NextTick
- nextTick的作用是将回调延迟到下次DOM更新周期之后执行，Vue在内部会批量处理这些更新，避免频繁操作DOM
- 实现原理
  - 在调用 this.$nextTick(cb) 之前：
    - 存在一个 callbacks 数组，用于存放所有的 cb 回调函数。
    - 存在一个 flushCallbacks 函数，用于执行 callbacks 数组中的所有回调函数。
    - 存在一个 timerFunc 函数，用于将 flushCallbacks 函数添加到任务队列中。
  - 当调用 this.nextTick(cb) 时：
    - nextTick 会将 cb 回调函数添加到 callbacks 数组中。
    - 判断在当前事件循环中是否是第一次调用 nextTick：
      - 如果是第一次调用，将执行 timerFunc 函数，添加 flushCallbacks 到任务队列。
      - 如果不是第一次调用，直接下一步。
      - 如果没有传递 cb 回调函数，则返回一个 Promise 实例。
```
// 存储所有的cb回调函数
const callbacks = [];
/*类似于节流的标记位，标记是否处于节流状态。防止重复推送任务*/
let pending = false;

/*遍历执行数组 callbacks 中的所有存储的cb回调函数*/
function flushCallbacks() {
  // 重置标记，允许下一个 nextTick 调用
  pending = false;
  /*执行所有cb回调函数*/
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
  // 清空回调数组，为下一次调用做准备
  callbacks.length = 0;
}

function nextTick(cb) {
  // 将回调函数cb添加到 callbacks 数组中
  callbacks.push(() => {
    cb();
  });
  
  // 第一次使用 nextTick 时，pending 为 false，下面的代码才会执行
  if (!pending) {
    // 改变标记位的值，如果有flushCallbacks被推送到任务队列中去则不需要重复推送
    pending = true;
    // 使用 Promise 机制，将 flushCallbacks 推送到任务队列
    Promise.resolve().then(flushCallbacks);
  }
}
```
测试结果
```
let message = '初始消息';
  
nextTick(() => {
  message = '更新后的消息';
  console.log('回调：', message); // 输出2: 更新后的消息
});

console.log('测试开始：', message); // 输出1: 初始消息
```
nextTick() 返回promise
```
await this.$nextTick();
......
......

// 或者
this.$nextTick().then(()=>{
    ......
})
```
核心是nextTick()如果没有参数，则返回一个promise
```
const callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
  callbacks.length = 0;
}

function nextTick(cb) {
  // 用于存储 Promise 的resolve函数
  let _resolve;
  callbacks.push(() => {
  /* ------------------ 新增start ------------------ */
    // 如果有cb回调函数，将cb存储到callbacks
    if (cb) {
      cb();
    } else if (_resolve) {
    // 如果参数cb不存在，则保存promise的的成功回调resolve
      _resolve();
    }
  /* ------------------ 新增end ------------------ */
  });
  if (!pending) {
    pending = true;
    Promise.resolve().then(flushCallbacks);
  }
  
  /* ------------------ 新增start ------------------ */
  if (!cb) {
    return new Promise((resolve, reject) => {
      // 保存resolve到callbacks数组中
      _resolve = resolve;
    });
  }
  /* ------------------ 新增end ------------------ */
}
```
测试结果
```
async function testNextTick() {
  let message = "初始消息";
  
  nextTick(() => {
    message = "更新后的消息";
  });
  console.log("传入回调：", message); // 输出1: 初始消息

  // 不传入回调的情况
  await nextTick(); // nextTick 返回 Promise
  console.log("未传入回调后：", message); // 输出2: 更新后的消息
}

// 运行测试
testNextTick();
```
为了防止浏览器不支持 「Promise」，「Vue」 选择了多种 API 来实现兼容 「nextTick」：
### Promise(微任务) --> MutationObserver(微任务) --> setImmediate(宏任务) --> setTimeout(宏任务)
- 利用了微任务和宏任务
  - 微任务：Promise、MutationObserver
  - 宏任务：setTimeout、setInterval
  - 优先使用微任务，若微任务不支持，则使用宏任务
```
// 存储所有的回调函数
const callbacks = [];
/* 类似于节流的标记位，标记是否处于节流状态。防止重复推送任务 */
let pending = false;

/* 遍历执行数组 callbacks 中的所有存储的 cb 回调函数 */
function flushCallbacks() {
  // 重置标记，允许下一个 nextTick 调用
  pending = false;
  /* 执行所有 cb 回调函数 */
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i](); // 依次调用存储的回调函数
  }
  // 清空回调数组，为下一次调用做准备
  callbacks.length = 0;
}

// 判断最终支持的 API：Promise / MutationObserver / setImmediate / setTimeout
let timerFunc;

if (typeof Promise !== "undefined") {
  // 创建一个已resolve的 Promise 实例
  var p = Promise.resolve();
  // 定义 timerFunc 为使用 Promise 的方式调度 flushCallbacks
  timerFunc = () => {
    // 使用 p.then 方法将 flushCallbacks 推送到微任务队列
    p.then(flushCallbacks);
  };
} else if (
  typeof MutationObserver !== "undefined" &&
  MutationObserver.toString() === "[object MutationObserverConstructor]"
) {
  /* 新建一个 textNode 的 DOM 对象，用 MutationObserver 绑定该 DOM 并指定回调函数。
   在 DOM 变化的时候则会触发回调，该回调会进入主线程（比任务队列优先执行），
   即 textNode.data = String(counter) 时便会加入该回调 */
   var counter = 1; // 用于切换文本节点的值
   var observer = new MutationObserver(flushCallbacks); // 创建 MutationObserver 实例
   var textNode = document.createTextNode(String(counter)); // 创建文本节点
   observer.observe(textNode, {
      characterData: true, // 监听文本节点的变化
   });
   // 定义 timerFunc 为使用 MutationObserver 的方式调度 flushCallbacks
  timerFunc = () => {
    counter = (counter + 1) % 2; // 切换 counter 的值（0 或 1）
    textNode.data = String(counter); // 更新文本节点以触发观察者
  };
} else if (typeof setImmediate !== "undefined") {
  /* 使用 setImmediate 将回调推入任务队列尾部 */
  timerFunc = () => {
    setImmediate(flushCallbacks); // 将 flushCallbacks 推送到宏任务队列
  };
} else {
  /* 使用 setTimeout 将回调推入任务队列尾部 */
  timerFunc = () => {
    setTimeout(flushCallbacks, 0); // 将 flushCallbacks 推送到宏任务队列
  };
}

function nextTick(cb) {
  // 用于存储 Promise 的解析函数
  let _resolve; 
  // 将回调函数 cb 添加到 callbacks 数组中
  callbacks.push(() => {
    // 如果有 cb 回调函数，将 cb 存储到 callbacks
    if (cb) {
      cb();
    } else if (_resolve) {
      // 如果参数 cb 不存在，则保存 Promise 的成功回调 resolve
      _resolve();
    }
  });

  // 第一次使用 nextTick 时，pending 为 false，下面的代码才会执行
  if (!pending) {
    // 改变标记位的值，如果有 nextTickHandler 被推送到任务队列中去则不需要重复推送
    pending = true;
    // 调用 timerFunc，将 flushCallbacks 推送到合适的任务队列
    timerFunc(flushCallbacks);
  }

  // 如果没有 cb 且环境支持 Promise，则返回一个 Promise
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      // 保存 resolve 到 callbacks 数组中
      _resolve = resolve;
    });
  }
}
```





