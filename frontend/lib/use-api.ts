'use client'

import useSWR, { type SWRConfiguration } from 'swr'
import {
  patientsApi,
  recordsApi,
  hospitalsApi,
  doctorsApi,
  filesApi,
  auditApi,
  analyticsApi,
  type Patient,
  type MedicalRecord,
  type Hospital,
  type User,
  type FileUpload,
  type AuditLog,
} from './api'

// Generic fetcher that handles errors
const createFetcher = <T>(fetchFn: () => Promise<T>) => async () => {
  try {
    return await fetchFn()
  } catch (error) {
    console.log('[v0] API fetch error:', error)
    throw error
  }
}

// ============================================
// PATIENTS HOOKS
// ============================================
export function usePatients(
  params?: { search?: string; status?: string; page?: number; limit?: number },
  config?: SWRConfiguration
) {
  return useSWR(
    ['patients', params],
    createFetcher(() => patientsApi.getAll(params)),
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

export function usePatient(id: string | null, config?: SWRConfiguration) {
  return useSWR(
    id ? ['patient', id] : null,
    id ? createFetcher(() => patientsApi.getById(id)) : null,
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

export function usePatientByCode(code: string | null, config?: SWRConfiguration) {
  return useSWR(
    code ? ['patientByCode', code] : null,
    code ? createFetcher(() => patientsApi.getByCode(code)) : null,
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

export function usePatientRecords(id: string | null, config?: SWRConfiguration) {
  return useSWR(
    id ? ['patient-records', id] : null,
    id ? createFetcher(() => patientsApi.getRecords(id)) : null,
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

// ============================================
// RECORDS HOOKS
// ============================================
export function useRecords(
  params?: {
    search?: string
    status?: string
    type?: string
    patientId?: string
    page?: number
    limit?: number
  },
  config?: SWRConfiguration
) {
  return useSWR(
    ['records', params],
    createFetcher(() => recordsApi.getAll(params)),
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

export function useRecord(id: string | null, config?: SWRConfiguration) {
  return useSWR(
    id ? ['record', id] : null,
    id ? createFetcher(() => recordsApi.getById(id)) : null,
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

// ============================================
// HOSPITALS HOOKS
// ============================================
export function useHospitals(config?: SWRConfiguration) {
  return useSWR(
    'hospitals',
    createFetcher(() => hospitalsApi.getAll()),
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

export function useHospital(id: string | null, config?: SWRConfiguration) {
  return useSWR(
    id ? ['hospital', id] : null,
    id ? createFetcher(() => hospitalsApi.getById(id)) : null,
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

// ============================================
// DOCTORS HOOKS
// ============================================
export function useDoctors(
  params?: { status?: string; hospitalId?: string },
  config?: SWRConfiguration
) {
  return useSWR(
    ['doctors', params],
    createFetcher(() => doctorsApi.getAll(params)),
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

// ============================================
// FILES HOOKS
// ============================================
export function useFiles(
  params?: { patientId?: string },
  config?: SWRConfiguration
) {
  return useSWR(
    ['files', params],
    createFetcher(() => filesApi.getAll(params)),
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

// ============================================
// AUDIT HOOKS
// ============================================
export function useAuditLogs(
  params?: {
    action?: string
    userId?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  },
  config?: SWRConfiguration
) {
  return useSWR(
    ['audit', params],
    createFetcher(() => auditApi.getAll(params)),
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

// ============================================
// ANALYTICS HOOKS
// ============================================
export function useDashboardStats(
  enabled: boolean = true,
  config?: SWRConfiguration
) {
  return useSWR(
    enabled ? 'dashboard-stats' : null,
    enabled ? createFetcher(() => analyticsApi.getDashboardStats()) : null,
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

export function useRecordStats(
  params?: { startDate?: string; endDate?: string },
  config?: SWRConfiguration
) {
  return useSWR(
    ['record-stats', params],
    createFetcher(() => analyticsApi.getRecordStats(params)),
    {
      revalidateOnFocus: false,
      ...config,
    }
  )
}

// ============================================
// TYPE EXPORTS FOR COMPONENTS
// ============================================
export type { Patient, MedicalRecord, Hospital, User, FileUpload, AuditLog }
