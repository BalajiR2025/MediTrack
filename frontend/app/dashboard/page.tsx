'use client'

import { Users, FileText, Building2, Activity, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useDashboardStats, useRecords, usePatients, usePatientRecords } from '@/lib/use-api'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, Line, LineChart } from 'recharts'

export default function DashboardPage() {
  const { user } = useAuth()
  const role = user?.role || 'patient'

  const { data: stats, isLoading: statsLoading } = useDashboardStats(role !== 'patient')
  const { data: allPatients } = usePatients()
  const patient = allPatients?.patients?.[0]
  const { data: recordsData } = useRecords(role === 'patient' ? { patientId: patient?.id } : undefined)

  const recentRecords = (recordsData?.records ?? []).slice(0, 5)
  const pendingRecords = (recordsData?.records ?? []).filter((r) => r.status === 'pending')
  const flaggedRecords = (recordsData?.records ?? []).filter((r) => r.is_flagged)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader title="Dashboard" />

      <div className="flex-1 space-y-6 p-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            {role === 'admin' && 'Manage hospitals, doctors, and system overview.'}
            {role === 'doctor' && 'Review patient records and manage appointments.'}
            {role === 'staff' && 'Register patients and create medical records.'}
            {role === 'patient' && 'View your medical records and health history.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {role === 'admin' && (
            <>
              <StatCard
                title="Total Hospitals"
                value={stats?.totalHospitals ?? 0}
                description="Active medical centers"
                icon={Building2}
                trend={{ value: 8, label: 'from last month' }}
              />
              <StatCard
                title="Total Doctors"
                value={stats?.totalDoctors ?? 0}
                description="Registered physicians"
                icon={Users}
                trend={{ value: 12, label: 'from last month' }}
              />
              <StatCard
                title="Total Patients"
                value={stats?.totalPatients ?? 0}
                description="Active patients"
                icon={Activity}
                trend={{ value: 15, label: 'from last month' }}
              />
              <StatCard
                title="Medical Records"
                value={stats?.totalRecords ?? 0}
                description="Total records"
                icon={FileText}
                trend={{ value: 22, label: 'from last month' }}
              />
            </>
          )}

          {role === 'doctor' && (
            <>
              <StatCard
                title="My Patients"
                value="128"
                description="Under your care"
                icon={Users}
                trend={{ value: 5, label: 'from last week' }}
              />
              <StatCard
                title="Pending Reviews"
                value={pendingRecords.length}
                description="Awaiting approval"
                icon={Clock}
              />
              <StatCard
                title="Approved Today"
                value="12"
                description="Records processed"
                icon={CheckCircle2}
                trend={{ value: 18, label: 'from yesterday' }}
              />
              <StatCard
                title="Flagged Cases"
                value={flaggedRecords.length}
                description="Require attention"
                icon={AlertTriangle}
              />
            </>
          )}

          {role === 'staff' && (
            <>
              <StatCard
                title="Registered Today"
                value="8"
                description="New patients"
                icon={Users}
                trend={{ value: 20, label: 'from yesterday' }}
              />
              <StatCard
                title="Records Created"
                value="15"
                description="Today's entries"
                icon={FileText}
              />
              <StatCard
                title="Pending Records"
                value={pendingRecords.length}
                description="Awaiting doctor review"
                icon={Clock}
              />
              <StatCard
                title="Total Patients"
                value={allPatients?.patients?.length ?? 0}
                description="In the system"
                icon={Activity}
              />
            </>
          )}

          {role === 'patient' && (
            <>
              <StatCard
                title="My Records"
                value={(recordsData?.records ?? []).length}
                description="Total medical records"
                icon={FileText}
              />
              <StatCard
                title="Last Visit"
                value="Dec 15"
                description="Most recent appointment"
                icon={Clock}
              />
              <StatCard
                title="Prescriptions"
                value="3"
                description="Active medications"
                icon={Activity}
              />
              <StatCard
                title="Next Appointment"
                value="Jan 5"
                description="Upcoming visit"
                icon={TrendingUp}
              />
            </>
          )}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Activity Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Records and patient registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  records: {
                    label: 'Records',
                    color: 'var(--color-chart-1)',
                  },
                  patients: {
                    label: 'Patients',
                    color: 'var(--color-chart-2)',
                  },
                }}
                className="h-[300px] w-full"
              >
                <LineChart data={stats?.monthlyActivity ?? []}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="records"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Records */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Records</CardTitle>
                <CardDescription>Latest medical record entries</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/records">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {record.patientName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {record.patientName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {record.diagnosis}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Patients per Hospital */}
          {(role === 'admin' || role === 'doctor') && (
            <Card>
              <CardHeader>
                <CardTitle>Patients per Hospital</CardTitle>
                <CardDescription>Distribution across facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    patients: {
                      label: 'Patients',
                      color: 'var(--color-chart-1)',
                    },
                  }}
                  className="h-[250px] w-full"
                >
                  <BarChart data={stats?.patientsPerHospital ?? []} layout="vertical">
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="hospital"
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="patients"
                      fill="var(--color-chart-1)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions or Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                {role === 'patient' ? 'Your Information' : 'Quick Actions'}
              </CardTitle>
              <CardDescription>
                {role === 'patient'
                  ? 'Personal health summary'
                  : 'Common tasks and shortcuts'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {role === 'patient' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Blood Type</p>
                      <p className="text-lg font-semibold">A+</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Allergies</p>
                      <p className="text-lg font-semibold">None</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Primary Doctor</p>
                      <p className="text-lg font-semibold">Dr. Wilson</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Insurance</p>
                      <p className="text-lg font-semibold">Active</p>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/records">View Medical History</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  {role === 'admin' && (
                    <>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/hospitals">
                          <Building2 className="mr-2 size-4" />
                          Manage Hospitals
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/doctors">
                          <Users className="mr-2 size-4" />
                          Approve Doctors
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/audit">
                          <FileText className="mr-2 size-4" />
                          View Audit Logs
                        </Link>
                      </Button>
                    </>
                  )}
                  {role === 'doctor' && (
                    <>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/patients">
                          <Users className="mr-2 size-4" />
                          Search Patient
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/records">
                          <FileText className="mr-2 size-4" />
                          Review Records
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/analytics">
                          <TrendingUp className="mr-2 size-4" />
                          View Analytics
                        </Link>
                      </Button>
                    </>
                  )}
                  {role === 'staff' && (
                    <>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/patients">
                          <Users className="mr-2 size-4" />
                          Register Patient
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/records">
                          <FileText className="mr-2 size-4" />
                          Create Record
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/uploads">
                          <Activity className="mr-2 size-4" />
                          Upload Documents
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
