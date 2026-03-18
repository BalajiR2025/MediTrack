// API Configuration
// Replace this with your backend URL (or set NEXT_PUBLIC_API_URL in .env.local)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Types
export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  bloodType: string
  address: string
  emergencyContact: string
  insuranceProvider: string
  insuranceNumber: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  type: string
  diagnosis: string
  treatment: string
  doctor: string
  hospital: string
  date: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  notes: string
  attachments: string[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'doctor' | 'staff' | 'patient'
  avatar?: string
  hospitalId?: string
  hospitalName?: string
  specialization?: string
  licenseNumber?: string
}

export interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  email: string
  totalPatients: number
  totalDoctors: number
  status: 'active' | 'inactive'
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  details: string
  ipAddress: string
  timestamp: string
}

export interface FileUpload {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
  patientId: string
  patientName: string
  url?: string
}

// API Error handling
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorData.message || `HTTP error ${response.status}`,
      errorData
    )
  }
  return response.json()
}

// Auth token management
let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function getAuthToken(): string | null {
  if (!authToken && typeof window !== 'undefined') {
    authToken = localStorage.getItem('auth_token')
  }
  return authToken
}

// Base fetch with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  return handleResponse<T>(response)
}

// ============================================
// AUTH API
// ============================================
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiFetch<{ user: User; token?: string; access?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // backend may return `token` or `access`
    setAuthToken(response.token || response.access || null)
    return response
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } finally {
      setAuthToken(null)
    }
  },

  getCurrentUser: () => apiFetch<User>('/auth/me'),

  register: (data: Omit<User, 'id'> & { password: string }) =>
    apiFetch<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
}

// ============================================
// PATIENTS API
// ============================================
export const patientsApi = {
  getAll: (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.status) query.set('status', params.status)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())

    return apiFetch<any>(`/patients?${query}`).then((res) => {
      if (res?.results) {
        const pageSize = params?.limit || 20
        return {
          patients: res.results as Patient[],
          total: res.count,
          page: params?.page ?? 1,
          totalPages: Math.ceil(res.count / pageSize),
        }
      }

      return {
        patients: (res as Patient[]) || [],
        total: Array.isArray(res) ? (res as Patient[]).length : 0,
        page: 1,
        totalPages: 1,
      }
    })
  },

  getById: (id: string) => apiFetch<Patient>(`/patients/${id}`),

  getByCode: (code: string) =>
    apiFetch<Patient>(`/patients/by-code/?code=${encodeURIComponent(code)}`),

  create: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Patient>) =>
    apiFetch<Patient>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/patients/${id}`, {
      method: 'DELETE',
    }),

  getRecords: (id: string) =>
    apiFetch<MedicalRecord[]>(`/patients/${id}/records`),
}

// ============================================
// MEDICAL RECORDS API
// ============================================
export const recordsApi = {
  getAll: (params?: {
    search?: string
    status?: string
    type?: string
    patientId?: string
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.status) query.set('status', params.status)
    if (params?.type) query.set('type', params.type)
    if (params?.patientId) query.set('patientId', params.patientId)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())

    return apiFetch<any>(`/records?${query}`).then((res) => {
      if (res?.results) {
        const pageSize = params?.limit || 20
        return {
          records: res.results as MedicalRecord[],
          total: res.count,
          page: params?.page ?? 1,
          totalPages: Math.ceil(res.count / pageSize),
        }
      }

      return {
        records: (res as MedicalRecord[]) || [],
        total: Array.isArray(res) ? (res as MedicalRecord[]).length : 0,
        page: 1,
        totalPages: 1,
      }
    })
  },

  getById: (id: string) => apiFetch<MedicalRecord>(`/records/${id}`),

  create: (data: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<MedicalRecord>('/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<MedicalRecord>) =>
    apiFetch<MedicalRecord>(`/records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/records/${id}`, {
      method: 'DELETE',
    }),

  approve: (id: string) =>
    apiFetch<MedicalRecord>(`/records/${id}/approve`, {
      method: 'POST',
    }),

  reject: (id: string, reason?: string) =>
    apiFetch<MedicalRecord>(`/records/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  flag: (id: string, reason: string) =>
    apiFetch<MedicalRecord>(`/records/${id}/flag`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
}

// ============================================
// HOSPITALS API
// ============================================
export const hospitalsApi = {
  getAll: () => apiFetch<Hospital[]>('/hospitals'),

  getById: (id: string) => apiFetch<Hospital>(`/hospitals/${id}`),

  create: (data: Omit<Hospital, 'id' | 'totalPatients' | 'totalDoctors'>) =>
    apiFetch<Hospital>('/hospitals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Hospital>) =>
    apiFetch<Hospital>(`/hospitals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/hospitals/${id}`, {
      method: 'DELETE',
    }),

  getDoctors: (id: string) => apiFetch<User[]>(`/hospitals/${id}/doctors`),

  getPatients: (id: string) => apiFetch<Patient[]>(`/hospitals/${id}/patients`),
}

// ============================================
// DOCTORS API
// ============================================
export const doctorsApi = {
  getAll: (params?: { status?: string; hospitalId?: string }) => {
    const query = new URLSearchParams()
    if (params?.status) query.set('status', params.status)
    if (params?.hospitalId) query.set('hospitalId', params.hospitalId)
    
    return apiFetch<User[]>(`/doctors?${query}`)
  },

  getById: (id: string) => apiFetch<User>(`/doctors/${id}`),

  approve: (id: string) =>
    apiFetch<User>(`/doctors/${id}/approve`, {
      method: 'POST',
    }),

  reject: (id: string) =>
    apiFetch<User>(`/doctors/${id}/reject`, {
      method: 'POST',
    }),
}

// ============================================
// FILES API
// ============================================
export const filesApi = {
  getAll: (params?: { patientId?: string }) => {
    const query = new URLSearchParams()
    if (params?.patientId) query.set('patientId', params.patientId)
    
    return apiFetch<FileUpload[]>(`/files?${query}`)
  },

  upload: async (file: File, patientId: string) => {
    const token = getAuthToken()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('patientId', patientId)

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    return handleResponse<FileUpload>(response)
  },

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/files/${id}`, {
      method: 'DELETE',
    }),

  download: (id: string) => `${API_BASE_URL}/files/${id}/download`,
}

// ============================================
// AUDIT LOGS API
// ============================================
export const auditApi = {
  getAll: (params?: {
    action?: string
    userId?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.action) query.set('action', params.action)
    if (params?.userId) query.set('userId', params.userId)
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    
    return apiFetch<{ logs: AuditLog[]; total: number; page: number; totalPages: number }>(
      `/audit?${query}`
    )
  },
}

// ============================================
// ANALYTICS API
// ============================================
export const analyticsApi = {
  getDashboardStats: () =>
    apiFetch<{
      totalPatients: number
      totalDoctors: number
      totalRecords: number
      pendingApprovals: number
      totalHospitals: number
      monthlyActivity: { month: string; records: number; patients: number }[]
      recordsByStatus: { status: string; count: number }[]
      patientsPerHospital: { hospital: string; patients: number }[]
    }>('/analytics/dashboard'),

  getRecordStats: (params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams()
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    
    return apiFetch<{
      total: number
      approved: number
      pending: number
      rejected: number
      flagged: number
      byType: { type: string; count: number }[]
    }>(`/analytics/records?${query}`)
  },
}

// ============================================
// USER SETTINGS API
// ============================================
export const settingsApi = {
  getProfile: () => apiFetch<User>('/settings/profile'),

  updateProfile: (data: Partial<User>) =>
    apiFetch<User>('/settings/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ message: string }>('/settings/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getNotificationSettings: () =>
    apiFetch<{
      emailNotifications: boolean
      smsNotifications: boolean
      appointmentReminders: boolean
      recordUpdates: boolean
      securityAlerts: boolean
    }>('/settings/notifications'),

  updateNotificationSettings: (settings: {
    emailNotifications?: boolean
    smsNotifications?: boolean
    appointmentReminders?: boolean
    recordUpdates?: boolean
    securityAlerts?: boolean
  }) =>
    apiFetch('/settings/notifications', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    }),
}
