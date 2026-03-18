'use client'

import { useState } from 'react'
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, MapPin, Droplet, User } from 'lucide-react'
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
import { useAuth } from '@/lib/auth-context'
import { patients, medicalRecords, type Patient } from '@/lib/demo-data'
import { toast } from 'sonner'
import Link from 'next/link'

export default function PatientsPage() {
  const { user } = useAuth()
  const role = user?.role || 'patient'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Filter patients based on search
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Patient registered successfully')
    setIsAddDialogOpen(false)
  }

  const getPatientRecords = (patientId: string) => {
    return medicalRecords.filter((r) => r.patientId === patientId)
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Patients"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">
              {role === 'staff' ? 'Register and manage patient records' : 'View and search patient information'}
            </p>
          </div>
          {(role === 'staff' || role === 'admin') && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Register New Patient</DialogTitle>
                  <DialogDescription>
                    Enter the patient information to create a new record.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPatient}>
                  <FieldGroup className="gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="name">Full Name</FieldLabel>
                        <Input id="name" placeholder="John Smith" required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="age">Age</FieldLabel>
                        <Input id="age" type="number" placeholder="30" required />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="gender">Gender</FieldLabel>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="bloodType">Blood Type</FieldLabel>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input id="email" type="email" placeholder="patient@email.com" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Input id="phone" placeholder="+1 (555) 000-0000" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="address">Address</FieldLabel>
                      <Input id="address" placeholder="123 Main St, City, State" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="emergency">Emergency Contact</FieldLabel>
                      <Input id="emergency" placeholder="+1 (555) 000-0000" required />
                    </Field>
                  </FieldGroup>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Register Patient</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 size-4" />
            Filters
          </Button>
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Patients</CardTitle>
            <CardDescription>{filteredPatients.length} patients found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Blood Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Records</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {patient.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} yrs, {patient.gender}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.id}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <p className="text-sm">{patient.email}</p>
                        <p className="text-xs text-muted-foreground">{patient.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="secondary">{patient.bloodType}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {getPatientRecords(patient.id).length} records
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedPatient(patient)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/records?patient=${patient.id}`}>
                              View Records
                            </Link>
                          </DropdownMenuItem>
                          {(role === 'doctor' || role === 'staff') && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/records?patient=${patient.id}&new=true`}>
                                  Add Record
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Patient Details Sheet */}
        <Sheet open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <SheetContent className="sm:max-w-md">
            {selectedPatient && (
              <>
                <SheetHeader>
                  <SheetTitle>Patient Details</SheetTitle>
                  <SheetDescription>Complete patient information</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Patient ID: {selectedPatient.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="size-4 text-muted-foreground" />
                      <span>{selectedPatient.age} years old, {selectedPatient.gender}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Droplet className="size-4 text-muted-foreground" />
                      <span>Blood Type: {selectedPatient.bloodType}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="size-4 mt-0.5 text-muted-foreground" />
                      <span>{selectedPatient.address}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Emergency Contact</h4>
                    <p className="text-sm text-muted-foreground">{selectedPatient.emergencyContact}</p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Medical Records</h4>
                    <p className="text-2xl font-bold">{getPatientRecords(selectedPatient.id).length}</p>
                    <p className="text-sm text-muted-foreground">Total records on file</p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/dashboard/records?patient=${selectedPatient.id}`}>
                        View Records
                      </Link>
                    </Button>
                    {(role === 'doctor' || role === 'staff') && (
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/records?patient=${selectedPatient.id}&new=true`}>
                          Add Record
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
