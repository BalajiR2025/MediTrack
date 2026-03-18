'use client'

import { useState } from 'react'
import { Search, Plus, Building2, Users, Phone, MapPin, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { hospitals, type Hospital } from '@/lib/demo-data'
import { toast } from 'sonner'

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Hospital added successfully')
    setIsAddDialogOpen(false)
  }

  const totalDoctors = hospitals.reduce((acc, h) => acc + h.doctors, 0)
  const totalPatients = hospitals.reduce((acc, h) => acc + h.patients, 0)
  const activeHospitals = hospitals.filter((h) => h.status === 'active').length

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Hospitals"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Hospitals' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hospital Management</h1>
            <p className="text-muted-foreground">
              Manage hospitals and medical centers in the network
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Add Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Hospital</DialogTitle>
                <DialogDescription>
                  Register a new hospital in the MediTrack network.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddHospital}>
                <FieldGroup className="gap-4 py-4">
                  <Field>
                    <FieldLabel>Hospital Name</FieldLabel>
                    <Input placeholder="City General Hospital" required />
                  </Field>
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Input placeholder="123 Medical Center Dr, City, State" required />
                  </Field>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input placeholder="+1 (555) 000-0000" required />
                  </Field>
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Hospital</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Building2 className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hospitals.length}</p>
                  <p className="text-sm text-muted-foreground">Total Hospitals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-success/10 p-3">
                  <Building2 className="size-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeHospitals}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-secondary/10 p-3">
                  <Users className="size-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalDoctors}</p>
                  <p className="text-sm text-muted-foreground">Total Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-warning/10 p-3">
                  <Users className="size-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalPatients.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Hospitals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="size-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{hospital.name}</CardTitle>
                      <Badge
                        variant={hospital.status === 'active' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {hospital.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => toast.info('Edit feature coming soon')}>
                        <Edit className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => toast.error('Delete feature coming soon')}>
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="size-4 mt-0.5 shrink-0" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4 shrink-0" />
                    <span>{hospital.phone}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="text-2xl font-bold">{hospital.doctors}</p>
                    <p className="text-xs text-muted-foreground">Doctors</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{hospital.patients.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Building2 className="size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No hospitals found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
