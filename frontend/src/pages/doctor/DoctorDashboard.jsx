import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {

  const navigate = useNavigate();

  return (

    <div>

      <h2>Doctor Dashboard</h2>

      <p>Scan patient QR to view records.</p>

      <button onClick={() => navigate("/")}>
        Logout
      </button>

    </div>

  );

}