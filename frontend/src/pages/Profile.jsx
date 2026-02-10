import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

export default function Profile() {
  const { user, fetchProfile } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      setLoading(true)
      fetchProfile().catch(err => {
        setError('Unable to fetch profile. Please login again.')
      }).finally(() => setLoading(false))
    }
  }, [])

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading your profile...</p>
    </div>
  )
  
  if (error) return (
    <div className="profile-card">
      <div className="error-message">❌ {error}</div>
      <button onClick={() => navigate('/login')} style={{ marginTop: '1rem', width: '100%' }}>Back to Login</button>
    </div>
  )
  
  if (!user) return (
    <div className="profile-card">
      <h2>Access Denied</h2>
      <p>Please login to view your profile.</p>
      <button onClick={() => navigate('/login')} style={{ marginTop: '1rem', width: '100%' }}>Go to Login</button>
    </div>
  )

  return (
    <div className="profile-card">
      <h2>👤 Your Profile</h2>
      <div className="profile-item">
        <label>Username</label>
        <div style={{ color: '#333', fontSize: '1.1rem' }}>{user.username}</div>
      </div>
      <div className="profile-item">
        <label>Email</label>
        <div style={{ color: '#333', fontSize: '1.1rem' }}>{user.email}</div>
      </div>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f2ff', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
        ✅ You are logged in
      </div>
    </div>
  )
}
