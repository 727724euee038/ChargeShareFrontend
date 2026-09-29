import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          <div className="nav-logo-icon">⚡</div>
          <span>ChargeShare</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/chargers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Browse Chargers
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>

          {/* EV User Links */}
          {role === 'user' && (
            <>
              <NavLink to="/user/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/user/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Bookings
              </NavLink>
            </>
          )}

          {/* Seller / Host Links */}
          {role === 'seller' && (
            <>
              <NavLink to="/seller/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/seller/my-chargers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Chargers
              </NavLink>
              <NavLink to="/seller/add-charger" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                + Add Charger
              </NavLink>
              <NavLink to="/seller/booking-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Requests
              </NavLink>
            </>
          )}

          {/* Admin Links */}
          {role === 'admin' && (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Admin Dashboard
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Users
              </NavLink>
              <NavLink to="/admin/chargers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Chargers
              </NavLink>
              <NavLink to="/admin/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Bookings
              </NavLink>
            </>
          )}
        </nav>

        <div className="nav-user">
          {user ? (
            <>
              <div className="user-badge">
                <span>{user.name}</span>
                <span className={`role-tag role-${role}`}>
                  {role === 'user' ? 'EV User' : role === 'seller' ? 'Host' : 'Admin'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
