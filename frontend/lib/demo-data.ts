export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  email: string
  phone: string
  bloodType: string
  address: string
  emergencyContact: string
  createdAt: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  symptoms: string
  diagnosis: string
  medicines: string[]
  notes: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  attachments?: string[]
}

export interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  doctors: number
  patients: number
  status: 'active' | 'inactive'
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  timestamp: string
  details: string
}

// Demo Patients
export const patients: Patient[] = []

// Demo Medical Records
export const medicalRecords: MedicalRecord[] = []

// Demo Hospitals
export const hospitals: Hospital[] = []

// Demo Audit Logs
export const auditLogs: AuditLog[] = []

// Analytics data (no demo content)
export const analyticsData = {
  patientsPerHospital: [],
  recordsPerDoctor: [],
  monthlyActivity: [],
  recordsByStatus: [],
}
