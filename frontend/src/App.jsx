import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import PatientLogin from "./pages/patient/PatientLogin";
import PatientRegister from "./pages/patient/PatientRegister";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientRecords from "./pages/patient/PatientRecords";

import DoctorLogin from "./pages/doctor/DoctorLogin";
import DoctorRegister from "./pages/doctor/DoctorRegister";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDetails from "./pages/doctor/PatientDetails";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthContext } from "./context/AuthProvider";

export default function App() {

  const { user, role, logout } = useContext(AuthContext);

  return (

    <BrowserRouter>

      <nav style={{display:"flex",gap:"20px",padding:"15px"}}>

        <Link to="/">🏥 MediTrack</Link>

        {!user ? (
          <>
            <Link to="/login">Patient Login</Link>
            <Link to="/register">Patient Register</Link>
            <Link to="/doctor/register">Doctor Register</Link>
            <Link to="/doctor/login">Doctor Login</Link>
          </>
        ) : (
          <>
            {role === "doctor" ? (
              <Link to="/doctor/dashboard">Dashboard</Link>
            ) : (
              <>
                <Link to="/patient/dashboard">Dashboard</Link>
                <Link to="/patient/profile">Profile</Link>
                <Link to="/patient/records">Records</Link>
              </>
            )}
            <button onClick={logout}>Logout</button>
          </>
        )}

      </nav>

      <Routes>

        <Route path="/" element={
          <div style={{textAlign:"center",marginTop:"80px"}}>
            <h1>Welcome to MediTrack</h1>
            <p>Your personal health management platform</p>
          </div>
        }/>

        {/* Patient */}
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/register" element={<PatientRegister />} />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/records"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientRecords />
            </ProtectedRoute>
          }
        />

        {/* Doctor */}
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patient/:id"
          element={
            <ProtectedRoute requiredRole="doctor">
              <PatientDetails />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}