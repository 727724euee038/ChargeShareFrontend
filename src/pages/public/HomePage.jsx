import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ChargerCard from '../../components/ChargerCard';

const HomePage = () => {
  const [featuredChargers, setFeaturedChargers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/chargers');
        if (res.data && res.data.success) {
          // Take first 3 chargers
          setFeaturedChargers(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured chargers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-tagline">⚡ Peer-to-Peer EV Charger Sharing</div>
        <h1 className="hero-title">Share Your Home EV Charger. Power Nearby Drivers.</h1>
        <p className="hero-desc">
          ChargeShare is a smart peer-to-peer marketplace that enables homeowners to monetize their idle EV chargers
          while helping electric vehicle drivers access reliable, neighborhood-level charging points.
        </p>

        <div className="hero-actions">
          <Link to="/chargers" className="btn btn-primary btn-lg">
            🔍 Find a Charger
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">
            🔌 List Your Charger
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <h2 style={{ fontSize: '1.8rem', color: 'var(--secondary)' }}>How ChargeShare Works</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          A simple three-step workflow designed for seamless EV charging
        </p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3 className="step-title">Locate Nearby Chargers</h3>
            <p className="step-desc">
              Filter by charger type (Type 2, CCS2, GB/T), location, and hourly pricing to discover convenient charging points.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">2</div>
            <h3 className="step-title">Reserve a Time Slot</h3>
            <p className="step-desc">
              Select your date and time with real-time conflict checks and instant estimated cost calculation.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">3</div>
            <h3 className="step-title">Charge & Drive</h3>
            <p className="step-desc">
              Once approved by the host, arrive at the location, plug in your electric vehicle, and power your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Chargers */}
      <section style={{ marginTop: '50px' }}>
        <div className="page-header">
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)' }}>Available Home Chargers</h2>
            <p className="page-subtitle">Recently verified peer-to-peer charging locations</p>
          </div>
          <Link to="/chargers" className="btn btn-outline">
            View All Chargers &rarr;
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading available chargers...
          </div>
        ) : (
          <div className="chargers-grid">
            {featuredChargers.map((charger) => (
              <ChargerCard key={charger._id} charger={charger} />
            ))}
          </div>
        )}
      </section>

      {/* Academic Project Context Banner */}
      <section style={{ marginTop: '50px' }}>
        <div className="card" style={{ background: 'var(--bg-subtle)', textAlign: 'center', padding: '30px' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>MERN Stack Project Implementation</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 16px auto', fontSize: '0.92rem' }}>
            Built as an end-to-end full-stack demonstration featuring role-based authentication, MongoDB data relations,
            conflict-free booking scheduling, and host request management.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Link to="/about" className="btn btn-outline btn-sm">
              Read Project Documentation
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm">
              Try Demo Accounts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
