
import './App.css';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Login from './Login';

function App() {
  return (
  <div className="container mt-4">
      <nav className="mb-4">
        <Link className="btn btn-outline-primary me-2" to="/">Home</Link>
        <Link className="btn btn-outline-success" to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
