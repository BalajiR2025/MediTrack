'use client'

import { TrendingUp, TrendingDown, Users, FileText, Building2, Activity } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { analyticsData } from '@/lib/demo-data'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const role = user?.role || 'patient'

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of system performance and trends
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Patients"
            value="5,680"
            icon={Users}
            trend={{ value: 12.5, label: 'from last month' }}
          />
          <StatCard
            title="Medical Records"
            value="12,458"
            icon={FileText}
            trend={{ value: 8.2, label: 'from last month' }}
          />
          <StatCard
            title="Active Hospitals"
            value="4"
            icon={Building2}
            trend={{ value: 0, label: 'no change' }}
          />
          <StatCard
            title="Avg. Records/Day"
            value="42"
            icon={Activity}
            trend={{ value: 15.3, label: 'from last week' }}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Monthly Activity Trend */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Monthly Activity Trend</CardTitle>
              <CardDescription>Records and patient registrations over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  records: {
                    label: 'Records',
                    color: 'var(--color-chart-1)',
                  },
                  patients: {
                    label: 'New Patients',
                    color: 'var(--color-chart-2)',
                  },
                }}
                className="h-[350px] w-full"
              >
                <AreaChart data={analyticsData.monthlyActivity}>
                  <defs>
                    <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="records"
                    stroke="var(--color-chart-1)"
                    fillOpacity={1}
                    fill="url(#colorRecords)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="var(--color-chart-2)"
                    fillOpacity={1}
                    fill="url(#colorPatients)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Records by Status */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Records by Status</CardTitle>
              <CardDescription>Distribution of medical record statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: 'Count',
                  },
                  Approved: {
                    label: 'Approved',
                    color: 'var(--color-chart-3)',
                  },
                  Pending: {
                    label: 'Pending',
                    color: 'var(--color-chart-4)',
                  },
                  Rejected: {
                    label: 'Rejected',
                    color: 'var(--color-chart-5)',
                  },
                  Flagged: {
                    label: 'Flagged',
                    color: 'var(--color-chart-1)',
                  },
                }}
                className="mx-auto aspect-square h-[300px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                  <Pie
                    data={analyticsData.recordsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {analyticsData.recordsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {analyticsData.recordsByStatus.map((item) => (
                  <div key={item.status} className="flex items-center gap-2 text-sm">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground">{item.status}:</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Patients per Hospital */}
          <Card>
            <CardHeader>
              <CardTitle>Patients per Hospital</CardTitle>
              <CardDescription>Patient distribution across facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  patients: {
                    label: 'Patients',
                    color: 'var(--color-chart-1)',
                  },
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={analyticsData.patientsPerHospital} layout="vertical">
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

          {/* Records per Doctor */}
          <Card>
            <CardHeader>
              <CardTitle>Records per Doctor</CardTitle>
              <CardDescription>Medical records created by each doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  records: {
                    label: 'Records',
                    color: 'var(--color-chart-2)',
                  },
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={analyticsData.recordsPerDoctor}>
                  <XAxis dataKey="doctor" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="records"
                    fill="var(--color-chart-2)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key metrics and their trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approval Rate</span>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="size-4" />
                    <span className="text-xs">+5%</span>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">94.2%</p>
                <p className="text-xs text-muted-foreground">Records approved on first review</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Review Time</span>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingDown className="size-4" />
                    <span className="text-xs">-12%</span>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">2.4 hrs</p>
                <p className="text-xs text-muted-foreground">Average time to review records</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="size-4" />
                    <span className="text-xs">+3%</span>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">4.8/5</p>
                <p className="text-xs text-muted-foreground">Based on patient feedback</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Uptime</span>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="size-4" />
                    <span className="text-xs">+0.1%</span>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">99.9%</p>
                <p className="text-xs text-muted-foreground">Last 30 days availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
