import React, { useState } from "react";

function Login( {updateUserDetails } ) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      if (
        formData.username === 'admin' &&
        formData.password === 'admin'
      ) {
        updateUserDetails({
          name: 'john cena',
          email: 'john@cena.com'
        });
        // setMessage(" Valid Credentials");
      } else {
        setMessage("Invalid Credentials");
      }
    } else {
      setMessage(null); 
    }
  };

  return (
    <div className="container text-center">
      {message && <p style={{ fontWeight: "bold" }}>{message}</p>}

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
