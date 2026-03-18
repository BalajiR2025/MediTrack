'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { AuthProvider, useAuth, UserRole } from '@/lib/auth-context'
import { toast } from 'sonner'

type AuthMode = 'login' | 'register'

function LoginForm() {
  const [mode, setMode] = useState<AuthMode | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [licenseId, setLicenseId] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [position, setPosition] = useState('')
  const [hospitalId, setHospitalId] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useAuth()
  const router = useRouter()

  const resetFlow = () => {
    setMode(null)
    setRole(null)
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setPhone('')
    setAddress('')
    setAge('')
    setGender('')
    setBloodGroup('')
    setLicenseId('')
    setSpecialization('')
    setExperienceYears('')
    setPosition('')
    setHospitalId('')
  }

  const handleModeSelect = (selectedMode: AuthMode) => {
    resetFlow()
    setMode(selectedMode)
  }

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    // prefill email for demo convenience
    setEmail(`${selectedRole}@meditrack.com`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mode || !role) {
      toast.error('Please select whether you want to login or register and choose a role.')
      return
    }

    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    if (mode === 'register') {
      if (!name) {
        toast.error('Please enter your name')
        return
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
    }

    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        toast.success('Login successful!')
      } else {
        await register({
          name,
          email,
          password,
          role,
          phone,
          address,
          age: age ? Number(age) : undefined,
          gender: gender || undefined,
          blood_group: bloodGroup || undefined,
          licenseId: licenseId || undefined,
          specialization: specialization || undefined,
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          position: position || undefined,
          hospitalId: hospitalId || undefined,
        })
        toast.success('Registration successful!')
      }
      router.push('/dashboard')
    } catch {
      toast.error(`${mode === 'login' ? 'Login' : 'Registration'} failed. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const modeLabel = mode === 'register' ? 'Register' : 'Login'
  const roleLabel = role ? `${role.charAt(0).toUpperCase()}${role.slice(1)}` : ''

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Heart className="size-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">MediTrack</h1>
          <p className="text-sm text-muted-foreground">Patient Health Record Management</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">
              {mode ? `${modeLabel} ${role ? `as ${roleLabel}` : ''}` : 'Welcome'}
            </CardTitle>
            <CardDescription>
              {mode
                ? role
                  ? `Enter your ${mode === 'login' ? 'login' : 'registration'} details below.`
                  : 'Select your role below.'
                : 'Choose whether you want to log in or create an account.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!mode ? (
              <div className="space-y-4">
                <Button className="w-full" onClick={() => handleModeSelect('login')}>
                  Log in to an existing account
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleModeSelect('register')}>
                  Create a new account
                </Button>
              </div>
            ) : !role ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => handleRoleSelect('doctor')}>Doctor</Button>
                  <Button onClick={() => handleRoleSelect('patient')}>Patient</Button>
                  <Button onClick={() => handleRoleSelect('staff')}>Staff</Button>
                  <Button onClick={() => handleRoleSelect('admin')}>Admin</Button>
                </div>
                <Button variant="ghost" size="sm" className="w-full" onClick={resetFlow}>
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft className="size-4" /> Back
                  </span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                )}

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4 text-muted-foreground" />
                        ) : (
                          <Eye className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </Field>
                </FieldGroup>

                {mode === 'register' && role === 'patient' && (
                  <>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="age">Age</FieldLabel>
                        <Input
                          id="age"
                          type="number"
                          placeholder="30"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          disabled={isLoading}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="gender">Gender</FieldLabel>
                        <Input
                          id="gender"
                          placeholder="Male / Female / Other"
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                          disabled={isLoading}
                        />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="bloodGroup">Blood Group</FieldLabel>
                        <Input
                          id="bloodGroup"
                          placeholder="A+ / O-"
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          disabled={isLoading}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="phone">Phone</FieldLabel>
                        <Input
                          id="phone"
                          placeholder="+1 555-0100"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={isLoading}
                        />
                      </Field>
                    </FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="address">Address</FieldLabel>
                      <Input
                        id="address"
                        placeholder="123 Main St, City" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={isLoading}
                      />
                    </Field>
                  </>
                )}

                {mode === 'register' && role === 'doctor' && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Input
                        id="phone"
                        placeholder="+1 555-0100"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="hospitalId">Hospital ID</FieldLabel>
                      <Input
                        id="hospitalId"
                        placeholder="Hospital UUID"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        disabled={isLoading}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="licenseId">License ID</FieldLabel>
                      <Input
                        id="licenseId"
                        placeholder="e.g. DR-123456"
                        value={licenseId}
                        onChange={(e) => setLicenseId(e.target.value)}
                        disabled={isLoading}
                      />
                    </Field>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="specialization">Specialization</FieldLabel>
                        <Input
                          id="specialization"
                          placeholder="e.g. Cardiology"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          disabled={isLoading}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="experienceYears">Experience (years)</FieldLabel>
                        <Input
                          id="experienceYears"
                          type="number"
                          placeholder="5"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          disabled={isLoading}
                        />
                      </Field>
                    </FieldGroup>
                  </>
                )}

                {mode === 'register' && role === 'staff' && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Input
                        id="phone"
                        placeholder="+1 555-0100"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="hospitalId">Hospital ID</FieldLabel>
                      <Input
                        id="hospitalId"
                        placeholder="Hospital UUID"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        disabled={isLoading}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="position">Position / Role</FieldLabel>
                      <Input
                        id="position"
                        placeholder="e.g. Reception"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        disabled={isLoading}
                      />
                    </Field>
                  </>
                )}

                {mode === 'register' && (
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                )}

                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setRole(null)} disabled={isLoading}>
                    Change role
                  </Button>
                  <Button type="button" variant="ghost" onClick={resetFlow} disabled={isLoading}>
                    Change mode
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {modeLabel}...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {modeLabel}
                      <ArrowRight className="size-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link href="#" className="underline hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-primary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
