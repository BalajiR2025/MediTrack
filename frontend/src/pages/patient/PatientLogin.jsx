import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function PatientLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if(username === "" || password === ""){
      alert("Enter username and password");
      return;
    }

    try {
      const res = await api.post("accounts/login/", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/patient/dashboard");
    } catch (e) {
      alert("Login failed");
    }

  };

  return (

    <div style={{textAlign:"center",marginTop:"120px"}}>

      <h2>Patient Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleLogin}>
        Login
      </button>

    </div>

  );

}