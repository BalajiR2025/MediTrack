'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Upload,
  BarChart3,
  Settings,
  Building2,
  ShieldCheck,
  ClipboardList,
  LogOut,
  Heart,
  ChevronUp,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth, type UserRole } from '@/lib/auth-context'

const navigation = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Hospitals', href: '/dashboard/hospitals', icon: Building2 },
    { name: 'Doctors', href: '/dashboard/doctors', icon: ShieldCheck },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Records', href: '/dashboard/records', icon: FileText },
    { name: 'Audit Logs', href: '/dashboard/audit', icon: ClipboardList },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ],
  doctor: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Records', href: '/dashboard/records', icon: FileText },
    { name: 'Uploads', href: '/dashboard/uploads', icon: Upload },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ],
  staff: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Records', href: '/dashboard/records', icon: FileText },
    { name: 'Uploads', href: '/dashboard/uploads', icon: Upload },
  ],
  patient: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Records', href: '/dashboard/records', icon: FileText },
    { name: 'Downloads', href: '/dashboard/uploads', icon: Upload },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout, switchRole } = useAuth()

  const role = user?.role || 'patient'
  const navItems = navigation[role]

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    doctor: 'Doctor',
    staff: 'Staff',
    patient: 'Patient',
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">MediTrack</span>
            <span className="text-xs text-muted-foreground">Health Records</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/dashboard/settings">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || 'User'}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {roleLabels[role]}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Demo: Switch Role
                </DropdownMenuLabel>
                {(['admin', 'doctor', 'staff', 'patient'] as UserRole[]).map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => switchRole(r)}
                    className={role === r ? 'bg-accent' : ''}
                  >
                    {roleLabels[r]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
