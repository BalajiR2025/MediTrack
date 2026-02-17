import { useEffect, useState } from "react";
import api from "../services/api";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    doctor_name: "",
    visit_date: "",
  });

  useEffect(() => {
    api.get("patient/records/")
      .then(res => setRecords(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("patient/records/", form);
    setRecords([...records, res.data]);
    setForm({ diagnosis: "", medicines: "", doctor_name: "", visit_date: "" });
  };

  return (
    <div>
      <h2>Medical Records</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={e => setForm({ ...form, diagnosis: e.target.value })}
        />

        <input placeholder="Medicines"
          value={form.medicines}
          onChange={e => setForm({ ...form, medicines: e.target.value })}
        />

        <input placeholder="Doctor Name"
          value={form.doctor_name}
          onChange={e => setForm({ ...form, doctor_name: e.target.value })}
        />

        <input type="date"
          value={form.visit_date}
          onChange={e => setForm({ ...form, visit_date: e.target.value })}
        />

        <button type="submit">Add Record</button>
      </form>

      <hr />

      <ul>
        {records.map((r, i) => (
          <li key={i}>
            <b>{r.diagnosis}</b> – {r.medicines} – {r.doctor_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
