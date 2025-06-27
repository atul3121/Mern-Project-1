import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await axios.post(
          `${serverEndpoint}/auth/logout`,
          {},
          { withCredentials: true }
        );
        dispatch({ type: SET_USER, payload: null });
        navigate("/"); // Redirect to home page
      } catch (error) {
        dispatch({ type: SET_USER, payload: null });
        navigate("/"); // Still redirect to home on error
      }
    };
    doLogout();
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
