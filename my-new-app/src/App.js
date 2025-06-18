
import './App.css';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import AppLayout from './layout/AppLayout';

function App() {
  return (
  // <div className="container mt-4">
  //     {/* <nav className="mb-4">
  //       <Link to="/">Home</Link><br></br>
  //       <Link to="/login">Login</Link>
  //     </nav> */}

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<AppLayout><Home/></AppLayout>} />
        <Route path="/login" element={<AppLayout><Login/></AppLayout>} />
      </Routes>
    // </div>
  );
}

export default App;
