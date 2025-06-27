import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function Dashboard() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h1>User Dashboard Page</h1>
      <Button as={Link} to="/logout" variant="danger" className="mt-4">
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;
