import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(form)
      navigate('/profile')
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) setError('Invalid username or password')
      else setError('Login failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome Back</h2>
      {error && <div className="error-message">❌ {error}</div>}
      <div>
        <input 
          placeholder="Username or Email" 
          value={form.username} 
          onChange={e => setForm({ ...form, username: e.target.value })} 
          required
        />
      </div>
      <div>
        <input 
          placeholder="Password" 
          type="password" 
          value={form.password} 
          onChange={e => setForm({ ...form, password: e.target.value })} 
          required
        />
      </div>
      <button type="submit">Login</button>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
        Don't have an account? <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
      </p>
    </form>
  )
}
