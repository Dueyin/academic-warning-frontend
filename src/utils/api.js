import axios from 'axios'
import store from '../store'
import router from '../router'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = store.state.auth.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    store.dispatch('setError', '请求发送失败')
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      const { status } = error.response
      
      switch (status) {
        case 401:
          store.dispatch('auth/logout')
          router.push('/login')
          store.dispatch('setError', '登录已过期，请重新登录')
          break
        case 403:
          store.dispatch('setError', '权限不足，无法访问该资源')
          break
        case 404:
          store.dispatch('setError', '请求的资源不存在')
          break
        default:
          store.dispatch('setError', error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      store.dispatch('setError', '网络连接失败，请检查您的网络')
    } else {
      store.dispatch('setError', '请求发送失败')
    }
    
    return Promise.reject(error)
  }
)

export default api 