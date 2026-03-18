import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PatientProfile() {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [profile, setProfile] = useState(null);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("patient/profile/");
        setProfile(res.data);
        setExists(true);
      } catch (e) {
        setExists(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const submit = async () => {
    if (!age || !gender || !bloodGroup || !phone) {
      alert("Fill all fields");
      return;
    }
    try {
      const res = await api.post("patient/profile/", {
        age: Number(age),
        gender,
        blood_group: bloodGroup,
        phone,
      });
      setProfile(res.data);
      setExists(true);
      alert("Profile created");
    } catch (e) {
      alert("Failed to create profile");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (exists && profile) {
    return (
      <div className="profile-card">
        <h2>Patient Profile</h2>
        <div className="profile-item">
          <label>Age</label>
          <div>{profile.age}</div>
        </div>
        <div className="profile-item">
          <label>Gender</label>
          <div>{profile.gender}</div>
        </div>
        <div className="profile-item">
          <label>Blood group</label>
          <div>{profile.blood_group}</div>
        </div>
        <div className="profile-item">
          <label>Phone</label>
          <div>{profile.phone}</div>
        </div>
        <div className="profile-item">
          <label>Profile ID (used in QR)</label>
          <div>{profile.id}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h2>Create Patient Profile</h2>

      <div style={{ marginBottom: "12px" }}>
        <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input
          placeholder="Blood Group (e.g. O+)"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <button onClick={submit}>Save Profile</button>
    </div>
  );
}

