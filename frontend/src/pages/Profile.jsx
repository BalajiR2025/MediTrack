import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get("/patient/profile/")
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        setError("Unable to fetch profile. Please login again.");
      });
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!profile) {
    return <h2>Loading profile...</h2>;
  }

  return (
    <div>
      <h2>Patient Profile</h2>
      <p>Age: {profile.age}</p>
      <p>Gender: {profile.gender}</p>
      <p>Blood Group: {profile.blood_group}</p>
      <p>Phone: {profile.phone}</p>
    </div>
  );
}