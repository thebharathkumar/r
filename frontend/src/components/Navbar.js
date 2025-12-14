import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/feed" className="nav-logo">
          📚 Micro-Learning
        </Link>

        <div className="nav-links">
          <Link
            to="/feed"
            className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}
          >
            Feed
          </Link>
          <Link
            to="/profile"
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
