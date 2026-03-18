import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PatientDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {

  try {

    const res = await api.get(`doctor/patient/${id}/`);

    setProfile(res.data.patient_profile);
    setRecords(res.data.medical_records);

  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      navigate("/doctor/login", { replace: true });
      return;
    }
    console.log(error);
  }

};

  if (!profile) {
    return <h2 style={{textAlign:"center"}}>Loading patient details...</h2>;
  }

  return (

    <div style={{textAlign:"center",marginTop:"50px"}}>

      <h2>Patient Details</h2>

      <h3>Profile</h3>

      <p><b>Age:</b> {profile.age}</p>
      <p><b>Gender:</b> {profile.gender}</p>
      <p><b>Blood Group:</b> {profile.blood_group}</p>
      <p><b>Phone:</b> {profile.phone}</p>

      <h3>Medical Records</h3>

      {records.length === 0 && <p>No records found</p>}

      {records.map((r) => (

        <div key={r.id} style={{border:"1px solid #ccc",margin:"10px",padding:"10px"}}>

          <p><b>Diagnosis:</b> {r.diagnosis}</p>
          <p><b>Medicines:</b> {r.medicines}</p>
          <p><b>Doctor:</b> {r.doctor_name}</p>
          <p><b>Date:</b> {r.visit_date}</p>

        </div>

      ))}

    </div>

  );

}