import axios from 'axios'
import JSONbig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [function(data) {
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      return data
    }
  }]

})

// 请求拦截器
request.interceptors.request.use(
  function(config) {
    // 获取本地存储的 user 信息
    const token = JSON.parse(window.localStorage.getItem('token'))
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

export default request
