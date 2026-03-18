import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function PatientRegister() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(null);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");

  const registerAccount = async () => {

    try {

      const res = await api.post("accounts/register/", { email, password, role: "patient" });
      // token is returned but email must be verified before login works
      if (res.data.dev_otp) setDevOtp(res.data.dev_otp);

      alert("Registered. Please verify OTP.");

      setStep(2);

    } catch (error) {

      alert("Registration failed");

    }

  };

  const verifyOtp = async () => {
    try {
      await api.post("accounts/verify-otp/", { email, otp });
      alert("Email verified");
      setStep(3);
    } catch (e) {
      alert("OTP verification failed");
    }
  };

  const createProfile = async () => {
    try {
      // login to obtain token
      const loginRes = await api.post("accounts/login/", { email, password });
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("role", loginRes.data.role);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      await api.post("patient/profile/", {
        age: Number(age),
        gender,
        blood_group: bloodGroup,
        phone,
      });

      alert("Profile created");
      navigate("/patient/dashboard");
    } catch (e) {
      alert("Failed to create profile");
    }
  };

  return (

    <div style={{textAlign:"center",marginTop:"80px"}}>

      <h2>Patient Register</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <br/><br/>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <br/><br/>

          <button onClick={registerAccount}>
            Register
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p>Enter the OTP sent to your email.</p>
          {devOtp && (
            <p><b>Dev OTP:</b> {devOtp}</p>
          )}
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
          />
          <br/><br/>
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <p>Enter patient details to complete profile.</p>
          <input placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} />
          <br/><br/>
          <input placeholder="Gender" value={gender} onChange={(e)=>setGender(e.target.value)} />
          <br/><br/>
          <input placeholder="Blood Group (e.g. O+)" value={bloodGroup} onChange={(e)=>setBloodGroup(e.target.value)} />
          <br/><br/>
          <input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <br/><br/>
          <button onClick={createProfile}>Create Profile</button>
        </>
      )}

    </div>

  );

}