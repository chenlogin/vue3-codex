- test 测试
  - polling 轮询
  - api 封装axios
```
Proxy 是 JavaScript 中的一个内置对象，用于创建一个对象的代理。通过代理，你可以拦截并重新定义对目标对象的基本操作，如属性读取、赋值、枚举等

const apiProxy = new Proxy(
  {}, // 目标对象
  {
    get: getKeyHandler, // get 是一个拦截器函数，当访问代理对象的属性时会被触发
  },
);

// get函数签名如下：
// get(target, prop, receiver)
// target：目标对象（在这里是 {}）
// prop：被访问的属性名（例如 getUser）
// receiver：代理对象本身（即 apiProxy）

核心功能是通过代理对象动态处理 API 请求
1、动态性：通过 Proxy 动态生成请求函数，避免手动定义每个 API 的请求方法。
2、缓存机制：每个 API 的请求函数只会生成一次，后续访问直接使用缓存，提高性能。
3、可配置性：通过 apiMap 集中管理 API 的 URL，便于维护和扩展。
```

