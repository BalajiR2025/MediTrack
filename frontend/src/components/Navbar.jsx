import { Link } from "react-router-dom";

export default function Navbar() {

  return (
    <nav>

      <h2>MediTrack</h2>

      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/doctor/login">Doctor Login</Link>

    </nav>
  );

}