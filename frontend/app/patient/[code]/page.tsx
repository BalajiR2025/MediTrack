'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import { usePatientByCode, usePatientRecords } from '@/lib/use-api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function PatientSummaryPage() {
  const params = useParams() as { code?: string }
  const code = params?.code ?? null

  const { data: patient, error, isLoading } = usePatientByCode(code)
  const { data: recordsData } = usePatientRecords(patient?.id ?? null)

  const [qrSrc, setQrSrc] = useState<string | null>(null)

  const recordList = useMemo(() => (recordsData?.records ?? []).slice(0, 5), [recordsData])

  useEffect(() => {
    if (!code) return
    const url = typeof window !== 'undefined' ? window.location.href : `https://example.com/patient/${code}`
    QRCode.toDataURL(url, { margin: 2, scale: 6 })
      .then(setQrSrc)
      .catch((err) => {
        console.error(err)
        toast.error('Failed to generate QR code')
      })
  }, [code])

  if (!code) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Patient code is required.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading patient information...</p>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Patient not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Summary</CardTitle>
            <CardDescription>Quick view via QR scan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{patient.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Patient Code</p>
                  <p className="text-lg font-semibold">{patient.patient_code}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-semibold">{patient.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-lg font-semibold">{patient.phone || '—'}</p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="mt-1 text-lg font-semibold">{patient.age ?? '—'}</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="mt-1 text-lg font-semibold">{patient.gender || '—'}</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p className="mt-1 text-lg font-semibold">{patient.blood_group || '—'}</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="mt-1 text-lg font-semibold">{patient.address || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">Scan to view</p>
                {qrSrc ? (
                  <img src={qrSrc} alt="QR code" className="mx-auto h-44 w-44" />
                ) : (
                  <div className="mt-4 h-44 w-44 animate-pulse rounded-xl bg-muted" />
                )}
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => {
                    if (qrSrc) {
                      const link = document.createElement('a')
                      link.href = qrSrc
                      link.download = `patient-${patient.patient_code}-qr.png`
                      link.click()
                    }
                  }}
                >
                  Download QR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
            <CardDescription>Last records for this patient</CardDescription>
          </CardHeader>
          <CardContent>
            {recordList.length === 0 ? (
              <p className="text-muted-foreground">No records found for this patient.</p>
            ) : (
              <div className="space-y-3">
                {recordList.map((record) => (
                  <div key={record.id} className="rounded-2xl border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{record.diagnosis || 'Medical record'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                        {record.status}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{record.notes || 'No notes'}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
