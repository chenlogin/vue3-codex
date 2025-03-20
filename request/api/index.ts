import axios from 'axios'
import apiMap, { type ApiKey, ApiFuncMap } from './api'

interface RequestOption {
  url?: string
  method?: string
  baseURL?: string
  timeout?: number
  globlLoading?: boolean // 是否使用全局loading
}

interface RequestResult {
  data: any
  success: boolean
}

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

const axiosDefaultOption: any = url => {
  let baseURL = process.env.NODE_ENV === 'production' ? '' : 'api/'
  return {
    method: 'post', // default
    baseURL,
    timeout: 30000, // default is `0` (no timeout)
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  }
}

const apiHandler = (url: string) => {
  return function (dataParams: any, customConfig: RequestOption = {}) {
    // 请求方式判断
    const requestMethod = customConfig.method || axiosDefaultOption().method
    const config: any = {
      url,
      ...axiosDefaultOption()
    }
    const dataKey = requestMethod?.toLowerCase() == 'get' ? 'params' : 'data'
    config[dataKey] = dataParams
    const mergeConfig = Object.assign(config, customConfig)
    return new Promise((resolve, reject) => {
      axios
        .request(mergeConfig)
        .then(function (response: any) {
          const data = response.data
          if (data.success || data.message == 'success') {
            resolve(data.data || data.result)
          } else if (data.code == 4000) {
            // 登录超时
            location.href = data.data
          } else {
            reject(data)
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
}

const getKeyHandler = (target: ApiFuncMap, prop: ApiKey) => {
  const url = apiMap[prop]
  if (!url) {
    console.error('网络请求未在字典配置，请配置之后在进行请求')
    return
  }
  const cacheFn = target[prop]
  if (!cacheFn) {
    target[prop] = apiHandler(url)
  }
  return target[prop]
}

const apiProxy = new Proxy<ApiFuncMap>(<ApiFuncMap>{}, {
  get: getKeyHandler
})

export default apiProxy
