import { useEffect, useState } from "react";
import api from "../services/api";

export default function PatientProfile() {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    blood_group: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
  API.get("/patient/profile/", {
  auth: {
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
  }
})
.then(res => setProfile(res.data))
.catch(err => console.log(err));
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await API.post("/patient/profile/", form);
    alert("Profile saved successfully");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <h2>Patient Profile</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Age"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
        />

        <input
          placeholder="Gender"
          value={form.gender}
          onChange={e => setForm({ ...form, gender: e.target.value })}
        />

        <input
          placeholder="Blood Group"
          value={form.blood_group}
          onChange={e => setForm({ ...form, blood_group: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
