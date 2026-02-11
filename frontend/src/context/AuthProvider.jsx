import React, { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const register = async (data) => {
    const res = await api.post('accounts/register/', data)
    return res.data
  }

  const login = async (credentials) => {
    const res = await api.post('accounts/login/', credentials)
    // expected: { token, user }
    const { token, user } = res.data
    if (token) localStorage.setItem('token', token)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    }
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/api/accounts/logout/')
    } catch (e) {
      // ignore; still clear client state
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const fetchProfile = async () => {
    const res = await api.get('/api/accounts/profile/')
    setUser(res.data)
    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
