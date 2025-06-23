import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ updateUserDetails }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));

    setMessage(null);
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (formData.username.trim() === '') {
      isValid = false;
      newErrors.username = "Username is mandatory";
    }

    if (formData.password.trim() === '') {
      isValid = false;
      newErrors.password = "Password is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const body = {
        username: formData.username,
        password: formData.password
      };

      try {
        const response = await axios.post(
          "http://localhost:5001/auth/login",
          body,
          { withCredentials: true }
        );

        if (response.data && response.data.user) {
          updateUserDetails(response.data.user);
          setMessage("Login successful!");
          navigate("/dashboard");
        } else {
          setErrors({ message: "Invalid credentials" });
        }

      } catch (error) {
        console.log(error);
        setErrors({ message: "Something went wrong, please try again" });
      }
    }
  };

  return (
    <div className="container text-center">
      {message && <p style={{ fontWeight: "bold" }}>{message}</p>}
      {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}

      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label><br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p style={{ color: "red" }}>{errors.username}</p>
          )}
        </div>

        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password}</p>
          )}
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
