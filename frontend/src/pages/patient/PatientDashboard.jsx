import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function PatientDashboard() {

  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("patient/profile/");
      setPatientId(res.data.id);
    } catch (e) {
      setPatientId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (

    <div style={{ textAlign: "center", marginTop: "80px" }}>

      <h1>Patient Dashboard</h1>

      <h3>Your Medical QR Code</h3>

      {loading ? (
        <p>Loading...</p>
      ) : !patientId ? (
        <div>
          <p>Create your patient profile first to generate a QR code.</p>
          <button onClick={() => navigate("/patient/profile")}>Create Profile</button>
        </div>
      ) : (
        <div>
        <QRCodeCanvas
          value={`${window.location.origin}/doctor/patient/${patientId}`}
          size={220}
        />
        <div style={{ marginTop: "14px" }}>
          <button onClick={loadProfile}>Refresh QR</button>
        </div>
        </div>
      )}

      <p>Show this QR code to the doctor</p>

    </div>

  );

}