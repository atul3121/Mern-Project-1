import React from 'react'
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div>
         <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
         <Link to="/Login">Login</Link>
    </div>
  )
}

export default Header