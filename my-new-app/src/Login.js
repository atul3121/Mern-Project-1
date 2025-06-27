import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint } from "./config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "./redux/user/actions";

function Login() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};
    if (!formData.username) {
      isValid = false;
      newErrors.username = "Username is mandatory";
    }
    if (!formData.password) {
      isValid = false;
      newErrors.password = "Password is mandatory";
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.post(`${serverEndpoint}/auth/login`, formData, { withCredentials: true });
        dispatch({ type: SET_USER, payload: res.data.user });
      } catch (err) {
        console.log(err);
        setErrors({ message: "Something went wrong, please try again" });
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const res = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, { withCredentials: true });
      dispatch({ type: SET_USER, payload: res.data.user });
    } catch (err) {
      console.log(err);
      setErrors({ message: "Error processing google auth, please try again" });
    }
  };

  const handleGoogleError = (err) => {
    console.log(err);
    setErrors({ message: "Error in google authorization flow, please try again" });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Sign in to Continue</h2>
          {errors.message && <div className="alert alert-danger">{errors.message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
          <div className="text-center">
            <div className="my-4 d-flex align-items-center text-muted">
              <hr className="flex-grow-1" />
              <span className="px-2">OR</span>
              <hr className="flex-grow-1" />
            </div>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
