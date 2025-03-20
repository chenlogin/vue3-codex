import api from './api'
import { polling, offPolling } from './polling'

const params = {
  id: 1,
  name: '张三',
}
const isLocal = location.hostname === 'localhost'

//post请求
await api.getPosts({}, { withCredentials: true })

// get请求
await api.getUser(
  { data: `${JSON.stringify(params)}` },
  {
    url: `/api/english/user`,
    method: 'get',
    withCredentials: true,
    baseURL: isLocal ? '/' : 'https://www.chenlogin.com',
  },
)

// 轮询
let pollingKey = ''
const startPolling = () => {
  if (pollingKey) return
  pollingKey = polling(
    api.getStatus,
    () => {
      console.log('===params===', params)
      return params
    },
    res => {
      console.log('===res===', res)
    },
    3000
  )
}
const endPolling = () => {
  if (pollingKey) {
    offPolling(pollingKey)
    pollingKey = ''
  }
}