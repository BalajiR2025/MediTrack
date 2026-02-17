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
    api.get("patient/profile/")
      .then(res => setForm(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("patient/profile/", form);
      setMessage("Profile saved successfully");
    } catch {
      setMessage("Error saving profile");
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
