import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/auth/register", formData);
      if (res.status === 201) {
        alert("Registration successful. Please login.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ message: error.response.data.message });
      } else {
        setErrors({ message: "Registration failed. Try again." });
      }
    }
  };

  return (
    <div className="container text-center">
      <h2>Register</h2>
      {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} /><br /><br />
        <input type="text" name="email" placeholder="Email" onChange={handleChange} /><br /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} /><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
