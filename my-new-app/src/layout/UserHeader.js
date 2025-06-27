import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

function UserHeader() {
  const userDetails = useSelector((state) => state.userDetails);

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Dashboard</Link>
        <div className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="secondary" id="dropdown-user">
              {userDetails ? userDetails.name : "Account"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/logout">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
