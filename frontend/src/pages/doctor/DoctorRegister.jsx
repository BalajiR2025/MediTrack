import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function DoctorRegister() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }
    try {
      await api.post("accounts/register/", { username, password, role: "doctor" });
      alert("Doctor registered. Now login.");
      navigate("/doctor/login");
    } catch (e) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Doctor Register</h2>

      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={register}>Register</button>
    </div>
  );
}

