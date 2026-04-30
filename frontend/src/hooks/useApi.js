import { useState, useEffect } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function useApi(url, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    setLoading(true)
    api.get(url)
      .then(res => { setData(res.data); setError(null) })
      .catch(err => setError(err.response?.data?.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [url, ...deps])

  return { data, loading, error, refetch: () => {} }
}

export default api
