import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>

      <ul>
        <li><Link to="/profile">Patient Profile</Link></li>
        <li><Link to="/records">Medical Records</Link></li>
      </ul>
    </div>
  );
}
