'use client'

import { useState } from 'react'
import { Search, Plus, Filter, MoreHorizontal, FileText, Calendar, User, Pill, CheckCircle, XCircle, Flag, Clock } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/lib/auth-context'
import { medicalRecords, patients, type MedicalRecord } from '@/lib/demo-data'
import { toast } from 'sonner'

export default function RecordsPage() {
  const { user } = useAuth()
  const role = user?.role || 'patient'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [actionDialog, setActionDialog] = useState<{ record: MedicalRecord; action: string } | null>(null)

  // Filter records based on search and status
  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    
    // Patient can only see their own records
    if (role === 'patient') {
      return matchesSearch && matchesStatus && record.patientId === 'P001' // Demo patient
    }
    return matchesSearch && matchesStatus
  })

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Medical record created successfully')
    setIsAddDialogOpen(false)
  }

  const handleRecordAction = () => {
    if (!actionDialog) return
    const { record, action } = actionDialog
    
    switch (action) {
      case 'approve':
        toast.success(`Record ${record.id} has been approved`)
        break
      case 'reject':
        toast.error(`Record ${record.id} has been rejected`)
        break
      case 'flag':
        toast.warning(`Record ${record.id} has been flagged for review`)
        break
    }
    setActionDialog(null)
  }

  const statusCounts = {
    all: medicalRecords.length,
    pending: medicalRecords.filter((r) => r.status === 'pending').length,
    approved: medicalRecords.filter((r) => r.status === 'approved').length,
    rejected: medicalRecords.filter((r) => r.status === 'rejected').length,
    flagged: medicalRecords.filter((r) => r.status === 'flagged').length,
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Medical Records"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Records' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
            <p className="text-muted-foreground">
              {role === 'doctor' && 'Review, approve, and manage patient medical records'}
              {role === 'staff' && 'Create and submit medical records for review'}
              {role === 'patient' && 'View your medical history and health records'}
              {role === 'admin' && 'Oversee all medical records in the system'}
            </p>
          </div>
          {(role === 'staff' || role === 'doctor') && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" />
                  Create Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Medical Record</DialogTitle>
                  <DialogDescription>
                    Add a new medical record for a patient. Records will be pending until approved by a doctor.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddRecord}>
                  <FieldGroup className="gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Patient</FieldLabel>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name} ({patient.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>Date</FieldLabel>
                        <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Symptoms</FieldLabel>
                      <Textarea placeholder="Describe the patient's symptoms..." rows={2} />
                    </Field>
                    <Field>
                      <FieldLabel>Diagnosis</FieldLabel>
                      <Input placeholder="Enter diagnosis" />
                    </Field>
                    <Field>
                      <FieldLabel>Medicines Prescribed</FieldLabel>
                      <Textarea placeholder="List medications (one per line)" rows={3} />
                    </Field>
                    <Field>
                      <FieldLabel>Notes</FieldLabel>
                      <Textarea placeholder="Additional notes and recommendations..." rows={3} />
                    </Field>
                  </FieldGroup>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {role === 'staff' ? 'Submit for Review' : 'Create Record'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Tabs for Status Filter */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all">
                All <Badge variant="secondary" className="ml-2">{statusCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending <Badge variant="secondary" className="ml-2">{statusCounts.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved <Badge variant="secondary" className="ml-2">{statusCounts.approved}</Badge>
              </TabsTrigger>
              {role !== 'patient' && (
                <>
                  <TabsTrigger value="rejected">
                    Rejected <Badge variant="secondary" className="ml-2">{statusCounts.rejected}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="flagged">
                    Flagged <Badge variant="secondary" className="ml-2">{statusCounts.flagged}</Badge>
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 sm:w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={statusFilter} className="mt-6">
            {/* Records Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="group cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelectedRecord(record)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {record.patientName.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{record.patientName}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {record.date}
                          </CardDescription>
                        </div>
                      </div>
                      <StatusBadge status={record.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">{record.diagnosis}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{record.symptoms}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {record.medicines.slice(0, 2).map((med, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <Pill className="mr-1 size-3" />
                          {med}
                        </Badge>
                      ))}
                      {record.medicines.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{record.medicines.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>ID: {record.id}</span>
                      <span>{record.doctorName}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <FileText className="size-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No records found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'No medical records match the current filter'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Record Details Sheet */}
        <Sheet open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            {selectedRecord && (
              <>
                <SheetHeader>
                  <SheetTitle>Medical Record Details</SheetTitle>
                  <SheetDescription>Record ID: {selectedRecord.id}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Patient Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedRecord.patientName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedRecord.patientName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        {selectedRecord.date}
                        <StatusBadge status={selectedRecord.status} />
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Attending Physician:</span>
                      <span className="font-medium">{selectedRecord.doctorName}</span>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-medium">
                      <Clock className="size-4 text-primary" />
                      Symptoms
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedRecord.symptoms}</p>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-medium">
                      <FileText className="size-4 text-primary" />
                      Diagnosis
                    </h4>
                    <p className="text-sm font-medium">{selectedRecord.diagnosis}</p>
                  </div>

                  {/* Medicines */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-medium">
                      <Pill className="size-4 text-primary" />
                      Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {selectedRecord.medicines.length > 0 ? (
                        selectedRecord.medicines.map((med, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg border p-3">
                            <Pill className="size-4 text-secondary" />
                            <span className="text-sm">{med}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No medications prescribed</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="mb-2 font-medium">Additional Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedRecord.notes}</p>
                  </div>

                  {/* Actions for Doctors */}
                  {role === 'doctor' && selectedRecord.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        className="flex-1"
                        onClick={() => setActionDialog({ record: selectedRecord, action: 'approve' })}
                      >
                        <CheckCircle className="mr-2 size-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setActionDialog({ record: selectedRecord, action: 'reject' })}
                      >
                        <XCircle className="mr-2 size-4" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActionDialog({ record: selectedRecord, action: 'flag' })}
                      >
                        <Flag className="mr-2 size-4" />
                        Flag
                      </Button>
                    </div>
                  )}

                  {/* Download for Patients */}
                  {role === 'patient' && (
                    <Button className="w-full" onClick={() => toast.success('Record downloaded')}>
                      Download Report
                    </Button>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Action Confirmation Dialog */}
        <AlertDialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionDialog?.action === 'approve' && 'Approve Record'}
                {actionDialog?.action === 'reject' && 'Reject Record'}
                {actionDialog?.action === 'flag' && 'Flag Record'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionDialog?.action === 'approve' &&
                  'Are you sure you want to approve this medical record? This action will make the record visible to the patient.'}
                {actionDialog?.action === 'reject' &&
                  'Are you sure you want to reject this medical record? Please provide a reason to the staff member.'}
                {actionDialog?.action === 'flag' &&
                  'Are you sure you want to flag this record for additional review? This will notify administrators.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRecordAction}>
                {actionDialog?.action === 'approve' && 'Approve'}
                {actionDialog?.action === 'reject' && 'Reject'}
                {actionDialog?.action === 'flag' && 'Flag'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
