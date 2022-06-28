import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net' // 根路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    // 添加请求头以及需要的属性
    // 配置以后以后类似用户数据的请求就不需要单独设置请求头数据了
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 最后需要把config return出去
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
export default request
