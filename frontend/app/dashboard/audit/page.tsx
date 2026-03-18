'use client'

import { useState } from 'react'
import { Search, Filter, Clock, User, FileText, Plus, CheckCircle, XCircle, Flag, Trash2, RefreshCw } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { auditLogs, type AuditLog } from '@/lib/demo-data'

const actionConfig: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  CREATE: { icon: Plus, color: 'text-success', bg: 'bg-success/10' },
  UPDATE: { icon: RefreshCw, color: 'text-primary', bg: 'bg-primary/10' },
  DELETE: { icon: Trash2, color: 'text-destructive', bg: 'bg-destructive/10' },
  APPROVE: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  REJECT: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  FLAG: { icon: Flag, color: 'text-warning', bg: 'bg-warning/10' },
}

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(auditLogs.map((log) => log.userName)))

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesUser = userFilter === 'all' || log.userName === userFilter
    return matchesSearch && matchesAction && matchesUser
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const getActionIcon = (action: string) => {
    const config = actionConfig[action] || { icon: FileText, color: 'text-muted-foreground', bg: 'bg-muted' }
    const Icon = config.icon
    return (
      <div className={`rounded-lg p-2 ${config.bg}`}>
        <Icon className={`size-4 ${config.color}`} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Audit Logs"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Audit Logs' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all system activities and user actions
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{auditLogs.length}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-success/10 p-3">
                  <Plus className="size-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {auditLogs.filter((l) => l.action === 'CREATE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Creates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <RefreshCw className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {auditLogs.filter((l) => l.action === 'UPDATE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-destructive/10 p-3">
                  <Trash2 className="size-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {auditLogs.filter((l) => l.action === 'DELETE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Deletes</p>
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
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="APPROVE">Approve</SelectItem>
              <SelectItem value="REJECT">Reject</SelectItem>
              <SelectItem value="FLAG">Flag</SelectItem>
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>{filteredLogs.length} events found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Target</TableHead>
                  <TableHead className="hidden lg:table-cell">Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const { date, time } = formatTimestamp(log.timestamp)
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getActionIcon(log.action)}
                          <Badge
                            variant={
                              log.action === 'DELETE' || log.action === 'REJECT'
                                ? 'destructive'
                                : log.action === 'CREATE' || log.action === 'APPROVE'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {log.action}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                            <User className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{log.userName}</p>
                            <p className="text-xs text-muted-foreground">{log.userId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">{log.target}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {log.details}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="size-4 text-muted-foreground" />
                          <div>
                            <p>{date}</p>
                            <p className="text-xs text-muted-foreground">{time}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {filteredLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="size-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No logs found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
