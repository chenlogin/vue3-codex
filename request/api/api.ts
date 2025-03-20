const apiMap = {
  getUser: '/api/user',
  getPosts: '/api/posts',
  getStatus: '/api/status',
}as const; // ← 使用 as const 锁定字面量类型


/**
 *  keyof 与 typeof 配合使用：
 * 1. typeof apiMap → 获取 apiMap 的对象类型 { getUser: string; getPosts: string }
 * 2. keyof → 提取该对象类型的键名联合类型 "getUser" | "getPosts"
 * 用 ApiKey 约束函数参数类型
 * function callApi(endpoint: ApiKey) { 
 *   // 这里只能传入 apiMap 中存在的属性名
 *   const url = apiMap[endpoint];
 *   // ... 发送请求
 * }
*/
export type ApiKey = keyof typeof apiMap // 等效于 "getUser" | "getPosts"

/**
 * // 等价于：
 * export type ApiFuncMap = {
 *  getUser: Function;    // 对应 apiMap.getUser 的键
 *  getPosts: Function;   // 对应 apiMap.getPosts 的键
 *  // ... 其他 apiMap 的键会自动扩展
 * }
 */
export type ApiFuncMap = {
  [k in ApiKey]: Function
}

export default apiMap
