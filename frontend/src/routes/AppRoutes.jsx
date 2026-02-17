import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PatientProfile from "./pages/PatientProfile";
import MedicalRecords from "./pages/MedicalRecords";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/records" element={<MedicalRecords />} />
      </Routes>
    </BrowserRouter>
  );
}
