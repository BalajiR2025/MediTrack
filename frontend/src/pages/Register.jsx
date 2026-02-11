import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    try {
      await register(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
        console.log("REGISTER ERROR:", err.response?.data);
        setError(JSON.stringify(err.response?.data));
      }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ Account created! Redirecting to login...</div>}
      <div>
        <input 
          placeholder="Username" 
          value={form.username} 
          onChange={e => setForm({ ...form, username: e.target.value })} 
          required
        />
      </div>
      <div>
        <input 
          placeholder="Email" 
          type="email" 
          value={form.email} 
          onChange={e => setForm({ ...form, email: e.target.value })} 
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
      <button type="submit">Register</button>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
        Already have an account? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
      </p>
    </form>
  )
}
