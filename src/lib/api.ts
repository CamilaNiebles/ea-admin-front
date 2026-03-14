import axios, { AxiosRequestConfig } from 'axios'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

const api = axios.create({
  baseURL: 'http://localhost:3100/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Do not retry the refresh endpoint itself
    if (originalRequest.url === '/auth/refresh') {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
          }
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

    if (!refreshToken) {
      isRefreshing = false
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const { data } = await api.post<{ accessToken: string }>('/auth/refresh', { refreshToken })
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
      processQueue(null, data.accessToken)
      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
      }
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export function get<T>(url: string, config?: AxiosRequestConfig) {
  return api.get<T>(url, config).then((r) => r.data)
}

export function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return api.post<T>(url, data, config).then((r) => r.data)
}

export function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return api.put<T>(url, data, config).then((r) => r.data)
}

export function del<T>(url: string, config?: AxiosRequestConfig) {
  return api.delete<T>(url, config).then((r) => r.data)
}

export default api
