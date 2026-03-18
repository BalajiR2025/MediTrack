'use client'

import { useState } from 'react'
import { Search, Filter, CheckCircle, XCircle, Clock, User, Mail, Building2, Stethoscope } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { toast } from 'sonner'

interface Doctor {
  id: string
  name: string
  email: string
  specialty: string
  hospital: string
  status: 'pending' | 'approved' | 'rejected'
  registeredAt: string
}

const demoDoctors: Doctor[] = [
  {
    id: 'D001',
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    specialty: 'Internal Medicine',
    hospital: 'City General Hospital',
    status: 'approved',
    registeredAt: '2024-01-15',
  },
  {
    id: 'D002',
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@hospital.com',
    specialty: 'Cardiology',
    hospital: 'Memorial Health Center',
    status: 'approved',
    registeredAt: '2024-02-20',
  },
  {
    id: 'D003',
    name: 'Dr. Mark Taylor',
    email: 'mark.taylor@hospital.com',
    specialty: 'Neurology',
    hospital: 'St. Mary Medical',
    status: 'pending',
    registeredAt: '2024-12-10',
  },
  {
    id: 'D004',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@hospital.com',
    specialty: 'Pediatrics',
    hospital: 'City General Hospital',
    status: 'pending',
    registeredAt: '2024-12-12',
  },
  {
    id: 'D005',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@hospital.com',
    specialty: 'Orthopedics',
    hospital: 'Pacific Care Hospital',
    status: 'rejected',
    registeredAt: '2024-11-28',
  },
]

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [doctors, setDoctors] = useState<Doctor[]>(demoDoctors)
  const [actionDialog, setActionDialog] = useState<{ doctor: Doctor; action: 'approve' | 'reject' } | null>(null)

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAction = () => {
    if (!actionDialog) return
    const { doctor, action } = actionDialog
    
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctor.id ? { ...d, status: action === 'approve' ? 'approved' : 'rejected' } : d
      )
    )
    
    toast.success(`Doctor ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
    setActionDialog(null)
  }

  const statusCounts = {
    all: doctors.length,
    pending: doctors.filter((d) => d.status === 'pending').length,
    approved: doctors.filter((d) => d.status === 'approved').length,
    rejected: doctors.filter((d) => d.status === 'rejected').length,
  }

  const getStatusBadge = (status: Doctor['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Doctor Management"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Doctors' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Management</h1>
          <p className="text-muted-foreground">
            Review and approve doctor registrations
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Stethoscope className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.all}</p>
                  <p className="text-sm text-muted-foreground">Total Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-warning/10 p-3">
                  <Clock className="size-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-success/10 p-3">
                  <CheckCircle className="size-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-destructive/10 p-3">
                  <XCircle className="size-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Doctors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Registrations</CardTitle>
            <CardDescription>{filteredDoctors.length} doctors found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="hidden md:table-cell">Specialty</TableHead>
                  <TableHead className="hidden lg:table-cell">Hospital</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {doctor.name.split(' ').slice(1).map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{doctor.specialty}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-muted-foreground" />
                        <span className="text-sm">{doctor.hospital}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{doctor.registeredAt}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {doctor.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-success hover:text-success"
                            onClick={() => setActionDialog({ doctor, action: 'approve' })}
                          >
                            <CheckCircle className="mr-1 size-4" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setActionDialog({ doctor, action: 'reject' })}
                          >
                            <XCircle className="mr-1 size-4" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {doctor.status === 'approved' ? 'Active' : 'Denied'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredDoctors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Stethoscope className="size-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No doctors found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Confirmation Dialog */}
        <AlertDialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionDialog?.action === 'approve' ? 'Approve Doctor' : 'Reject Doctor'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionDialog?.action === 'approve'
                  ? `Are you sure you want to approve ${actionDialog?.doctor.name}? They will be able to access the system and manage patient records.`
                  : `Are you sure you want to reject ${actionDialog?.doctor.name}? They will not be able to access the system.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={actionDialog?.action === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
                onClick={handleAction}
              >
                {actionDialog?.action === 'approve' ? 'Approve' : 'Reject'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
