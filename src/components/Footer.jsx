import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--secondary)' }}>
          <span>⚡ ChargeShare</span>
          <span style={{ fontWeight: '400', color: 'var(--text-light)' }}>|</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Peer-to-Peer Home EV Charger Sharing Platform</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <Link to="/chargers" style={{ color: 'var(--text-muted)' }}>Browse Chargers</Link>
          <Link to="/about" style={{ color: 'var(--text-muted)' }}>About Project</Link>
          <Link to="/login" style={{ color: 'var(--text-muted)' }}>Login</Link>
          <Link to="/register" style={{ color: 'var(--text-muted)' }}>Register</Link>
        </div>

        <div className="footer-academic-tag">
          Final-Year Engineering Project &bull; Built with MongoDB, Express.js, React.js & Node.js
        </div>
      </div>
    </footer>
  );
};

export default Footer;
