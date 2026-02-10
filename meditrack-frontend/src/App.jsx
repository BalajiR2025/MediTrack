import React, { useContext } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { AuthContext } from './context/AuthProvider'

export default function App() {
  const { user, logout } = useContext(AuthContext)

  return (
    <>
      <nav>
        <Link to="/">🏥 MediTrack</Link>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="welcome">
            <h1>Welcome to MediTrack</h1>
            <p>Your personal health management platform.</p>
            {!user && (
              <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
                <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link> or <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link> to get started
              </p>
            )}
          </div>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}
