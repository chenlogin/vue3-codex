import md5 from 'md5'

interface PollingInfo {
  func: Function
  callBack: Function
  timeout: number
  requestParams: any
}

const pollingMap: Map<string, PollingInfo> = new Map()

/**
 * 注册一个要轮询的方法
 * @param func 要轮询的方法
 * @param requestParams 调用方法要传的参数
 * @param callBack 轮询回调
 * @param timeout 每次轮询的延迟,默认值1000ms
 * @param immediate 是否立即开始轮询,默认值true
 * @returns 返回类似clearTimeout用的key值,用于停止轮询或手动开始轮询
 */
const polling = <T>(
  func: Function,
  requestParams: T,
  callBack: Function,
  timeout: number = 1000,
  immediate: boolean = true
) => {
  const mapKey: string = md5(`${Date.now()}${Math.random()}`)
  pollingMap.set(mapKey, {
    func,
    callBack,
    timeout,
    requestParams
  })
  if (immediate) {
    runPolling(mapKey)
  }
  console.log('开启了一个轮询', { mapKey })
  return mapKey
}

/**
 * 关闭一个方法的轮询
 * @param mapKey 从on方法返回的key值
 */
const offPolling = (mapKey: string) => {
  if (pollingMap.has(mapKey)) {
    pollingMap.delete(mapKey)
  }
  console.log('关闭了一个轮询', { mapKey })
}

/**
 * 开始轮询,可手动调用
 * @param mapKey 从on方法返回的key值
 */
const runPolling = async (mapKey: string) => {
  const info: PollingInfo | undefined = pollingMap.get(mapKey)
  if (!info) return
  const { func, requestParams, callBack, timeout } = info
  const params =
    typeof requestParams === 'function' ? await requestParams() : requestParams
  const res = await func(params, { isPolling: true }).catch(e => {
    console.error(e)
  })
  //再校验一次是否已经关闭了
  if (pollingMap.has(mapKey)) {
    callBack && callBack(res)
    setTimeout(() => {
      runPolling(mapKey)
    }, timeout)
  }
}

export { polling, offPolling, runPolling }
