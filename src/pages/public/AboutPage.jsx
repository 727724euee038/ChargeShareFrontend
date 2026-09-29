import React from 'react';

const AboutPage = () => {
  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">About ChargeShare Project</h1>
          <p className="page-subtitle">Final-Year MERN Stack Project Architecture & Overview</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '12px' }}>
          Problem Statement & Motivation
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '14px' }}>
          While electric vehicle (EV) adoption is accelerating rapidly, public fast-charging infrastructure remains sparse,
          crowded, and unreliable in many residential neighborhoods. Conversely, thousands of EV owners install dedicated
          private wallbox chargers in their homes that remain idle for over 70% to 80% of the day.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <strong>ChargeShare</strong> solves this bottleneck through a peer-to-peer (P2P) marketplace. Residential hosts
          can monetize their idle charging hardware, while visiting or nearby EV drivers get access to guaranteed,
          scheduled charging slots in convenient residential locations.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '16px' }}>
          System Architecture & Tech Stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '6px' }}>
            <h4 style={{ color: 'var(--secondary)', marginBottom: '6px' }}>MongoDB</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Document database storing User, Charger, and Booking models with schema validation and Mongoose references.
            </p>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '6px' }}>
            <h4 style={{ color: 'var(--secondary)', marginBottom: '6px' }}>Express.js & Node</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              REST API backend providing token-based authentication, role middleware, and conflict-detection scheduling logic.
            </p>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '6px' }}>
            <h4 style={{ color: 'var(--secondary)', marginBottom: '6px' }}>React.js & Vite</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Modular single-page application with reusable components, context state management, and protected client routes.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '14px' }}>
          Key Technical Mechanisms
        </h2>
        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.92rem' }}>
          <li>
            <strong>JWT Authentication:</strong> Secure password hashing with bcryptjs (10 salt rounds) and stateless JSON Web Tokens passed via Authorization headers.
          </li>
          <li>
            <strong>Role-Based Access Control (RBAC):</strong> Strict separation between EV Drivers (<code>user</code>), Charger Hosts (<code>seller</code>), and Administrators (<code>admin</code>).
          </li>
          <li>
            <strong>Conflict-Free Booking Algorithm:</strong> Verifies time interval overlaps <code>[startA &lt; endB && startB &lt; endA]</code> across all accepted bookings for the same charger and date before approving requests.
          </li>
          <li>
            <strong>Calculated Pricing:</strong> Dynamic rate estimation based on booking duration and host's specified hourly tariff.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
