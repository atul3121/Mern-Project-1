// src/Home.js
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container text-center">
      <h1>Welcome to the MERN Auth App</h1>
      <p>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Home;
