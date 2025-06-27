import { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config";
import { SET_USER } from "../redux/user/actions";
import { useNavigate } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "", name: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.username) {
      newErrors.username = "Username is mandatory";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is mandatory";
      isValid = false;
    }
    if (!formData.name) {
      newErrors.name = "Name is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${serverEndpoint}/auth/register`, formData, { withCredentials: true });
      // REMOVE THIS LINE:
      // dispatch({ type: SET_USER, payload: response.data.user });

      // After successful registration
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      if (error?.response?.status === 401)
        setErrors({ message: 'User already exists' });
      else
        setErrors({ message: 'Something went wrong, please try again' });
    }
  };

  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, { withCredentials: true });
      dispatch({ type: SET_USER, payload: response.data.user });
    } catch (error) {
      setErrors({ message: 'Something went wrong while google signin' });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Sign up with a new account</h2>

          {errors.message && <div className="alert alert-danger">{errors.message}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Username Input */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}
                className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>

          <div className="text-center mt-4">
            <div className="d-flex align-items-center text-muted">
              <hr className="flex-grow-1" />
              <span className="px-2">OR</span>
              <hr className="flex-grow-1" />
            </div>

            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin onSuccess={handleGoogleSignin} onError={() => {}} />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
