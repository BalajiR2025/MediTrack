import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PatientRecords() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [visitDate, setVisitDate] = useState("");

  const load = async () => {
    try {
      const res = await api.get("patient/records/");
      setRecords(res.data);
    } catch (e) {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addRecord = async () => {
    if (!diagnosis || !medicines || !doctorName || !visitDate) {
      alert("Fill all fields");
      return;
    }
    try {
      await api.post("patient/records/", {
        diagnosis,
        medicines,
        doctor_name: doctorName,
        visit_date: visitDate,
      });
      setDiagnosis("");
      setMedicines("");
      setDoctorName("");
      setVisitDate("");
      setLoading(true);
      await load();
      alert("Record added");
    } catch (e) {
      alert("Failed to add record (create patient profile first)");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-card">
      <h2>Medical Records</h2>

      <div style={{ marginBottom: "12px" }}>
        <input
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input
          placeholder="Medicines"
          value={medicines}
          onChange={(e) => setMedicines(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input
          placeholder="Doctor name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
        />
      </div>

      <button onClick={addRecord}>Add Record</button>

      <div style={{ marginTop: "18px" }}>
        {records.length === 0 ? (
          <p>No records yet</p>
        ) : (
          records
            .slice()
            .reverse()
            .map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "12px",
                  marginTop: "10px",
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 700 }}>{r.visit_date}</div>
                <div>
                  <b>Diagnosis:</b> {r.diagnosis}
                </div>
                <div>
                  <b>Medicines:</b> {r.medicines}
                </div>
                <div>
                  <b>Doctor:</b> {r.doctor_name}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

