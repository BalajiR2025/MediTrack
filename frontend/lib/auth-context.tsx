'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { authApi, setAuthToken, getAuthToken } from './api'

export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  hospital?: string
  avatar?: string
  phone?: string
  address?: string
  age?: number
  gender?: string
  blood_group?: string
  patientCode?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    password: string
    role: UserRole
    phone?: string
    address?: string
    age?: number
    gender?: string
    blood_group?: string
    licenseId?: string
    specialization?: string
    experienceYears?: number
    position?: string
    hospitalId?: string
  }) => Promise<void>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// NOTE: No demo user data is seeded here. Auth is driven by the backend.
// If the backend is unavailable, login/register will fail rather than falling back to dummy data.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token and fetch user
    const initAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const userData = await authApi.getCurrentUser()
          setUser(userData as User)
        } catch {
          // Token invalid or expired, clear it and any stored user
          setAuthToken(null)
          localStorage.removeItem('meditrack_user')
          setUser(null)
        }
      } else {
        // No token, clear any stored user data to avoid stale/demo profiles
        localStorage.removeItem('meditrack_user')
        setUser(null)
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(email, password)
      const loggedInUser = response.user as User
      setUser(loggedInUser)
      localStorage.setItem('meditrack_user', JSON.stringify(loggedInUser))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (data: {
      name: string
      email: string
      password: string
      role: UserRole
      phone?: string
      address?: string
      age?: number
      gender?: string
      blood_group?: string
      licenseId?: string
      specialization?: string
      experienceYears?: number
      position?: string
      hospitalId?: string
    }) => {
      const { name, email, password, role } = data
      setIsLoading(true)
      try {
        const response = await authApi.register(data)
        const registeredUser = response.user as User
        setUser(registeredUser)
        localStorage.setItem('meditrack_user', JSON.stringify(registeredUser))
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout errors
    }
    setUser(null)
    localStorage.removeItem('meditrack_user')
  }, [])

  const switchRole = useCallback((role: UserRole) => {
    // Switching role is not supported in production without re-authentication.
    console.warn('switchRole is not supported when using backend authentication.')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
