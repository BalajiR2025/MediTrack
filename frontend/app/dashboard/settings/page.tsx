'use client'

import { useState } from 'react'
import { User, Bell, Shield, Palette, Save, Camera } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    records: true,
    appointments: false,
  })

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile updated successfully')
  }

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved')
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Settings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 size-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 size-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 size-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 size-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="size-20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button type="button" variant="outline" size="sm">
                        <Camera className="mr-2 size-4" />
                        Change Photo
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <FieldGroup className="gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                        <Input id="firstName" defaultValue={user?.name?.split(' ')[0]} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                        <Input id="lastName" defaultValue={user?.name?.split(' ').slice(1).join(' ')} />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input id="email" type="email" defaultValue={user?.email} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                      <Input id="phone" placeholder="+1 (555) 000-0000" />
                    </Field>
                    {user?.hospital && (
                      <Field>
                        <FieldLabel htmlFor="hospital">Hospital</FieldLabel>
                        <Input id="hospital" defaultValue={user.hospital} disabled />
                      </Field>
                    )}
                  </FieldGroup>

                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 size-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Medical Record Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when records are updated
                      </p>
                    </div>
                    <Switch
                      checked={notifications.records}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, records: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appointment Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders for upcoming appointments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.appointments}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, appointments: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    <Save className="mr-2 size-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Field>
                      <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                      <Input id="currentPassword" type="password" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                      <Input id="newPassword" type="password" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                      <Input id="confirmPassword" type="password" />
                    </Field>
                    <div className="flex justify-end">
                      <Button type="button" onClick={() => toast.success('Password updated successfully')}>
                        Update Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app for additional security
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => toast.info('2FA setup coming soon')}>
                      Setup 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>Manage your active sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Chrome on macOS - Active now
                        </p>
                      </div>
                      <Badge variant="secondary">Current</Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.success('All other sessions logged out')}
                    >
                      Log Out Other Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how MediTrack looks for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Field>
                  <FieldLabel>Theme</FieldLabel>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select your preferred theme or use system settings
                  </p>
                </Field>

                <Separator />

                <Field>
                  <FieldLabel>Language</FieldLabel>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Separator />

                <Field>
                  <FieldLabel>Timezone</FieldLabel>
                  <Select defaultValue="america-new_york">
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-new_york">Eastern Time (ET)</SelectItem>
                      <SelectItem value="america-chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="america-denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="america-los_angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <div className="flex justify-end">
                  <Button onClick={() => toast.success('Appearance settings saved')}>
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
