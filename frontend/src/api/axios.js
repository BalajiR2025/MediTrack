import axios from 'axios'

const getApiBaseUrl = () => {
  // Prefer explicit env override for deployments
  const fromEnv = import.meta?.env?.VITE_API_BASE_URL
  if (fromEnv) return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`

  // Dev fallback: use same host as the frontend, port 8000
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000/api/`
  }

  return "http://127.0.0.1:8000/api/"
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

export default api
