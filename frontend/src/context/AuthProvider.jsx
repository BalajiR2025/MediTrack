import React, { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    const storedRole = localStorage.getItem('role')
    if (storedRole) setRole(storedRole)
    setLoading(false)
  }, [])

  const register = async (data) => {
    const res = await api.post('accounts/register/', data)
    const { token, user, role } = res.data
    if (token) localStorage.setItem('token', token)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    }
    if (role) {
      localStorage.setItem('role', role)
      setRole(role)
    }
    return res.data
  }

  const login = async (credentials) => {
    const res = await api.post('accounts/login/', credentials)
    const { token, user, role } = res.data
    if (token) localStorage.setItem('token', token)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
    }
    if (role) {
      localStorage.setItem('role', role)
      setRole(role)
    }
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('accounts/logout/')
    } catch (e) {
      // ignore; still clear client state
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    setUser(null)
    setRole(null)
  }

  const fetchProfile = async () => {
    const res = await api.get('accounts/profile/')
    setUser({ username: res.data.username })
    localStorage.setItem('user', JSON.stringify({ username: res.data.username }))
    if (res.data.role) {
      setRole(res.data.role)
      localStorage.setItem('role', res.data.role)
    }
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, register, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
