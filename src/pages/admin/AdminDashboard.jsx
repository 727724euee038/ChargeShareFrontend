import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load system statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Management Console</h1>
          <p className="page-subtitle">ChargeShare platform oversight, metrics, and user moderation</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Loading platform metrics...
        </div>
      ) : (
        <>
          {/* Key Metrics Row */}
          <div className="stats-grid">
            <StatCard title="Registered EV Users" value={stats?.totalUsers || 0} desc="Drivers seeking chargers" icon="🚗" />
            <StatCard title="Charger Hosts (Sellers)" value={stats?.totalSellers || 0} desc="Residential listing owners" icon="🏠" />
            <StatCard title="Active Chargers" value={stats?.totalChargers || 0} desc="Total listed charge points" icon="🔌" />
            <StatCard title="Total Bookings" value={stats?.totalBookings || 0} desc="Platform-wide bookings" icon="📋" />
            <StatCard title="Pending Requests" value={stats?.pendingBookings || 0} desc="Currently awaiting approval" icon="⏳" />
            <StatCard title="Accepted Sessions" value={stats?.acceptedBookings || 0} desc="Confirmed charging slots" icon="✅" />
          </div>

          {/* Quick Management Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div className="card">
              <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>👥 User Management</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.5' }}>
                View all registered drivers, hosts, and administrator accounts. Moderate and remove inactive or fraudulent users.
              </p>
              <Link to="/admin/users" className="btn btn-outline btn-block btn-sm">
                Manage Registered Users &rarr;
              </Link>
            </div>

            <div className="card">
              <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>🔌 Charger Listings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.5' }}>
                Audit listed home charging points, verify location accuracy, power ratings, and remove inappropriate listings.
              </p>
              <Link to="/admin/chargers" className="btn btn-outline btn-block btn-sm">
                Manage Charger Listings &rarr;
              </Link>
            </div>

            <div className="card">
              <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>📋 Platform Bookings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.5' }}>
                Monitor end-to-end booking activities, session statuses, conflict resolution, and remove disputed records.
              </p>
              <Link to="/admin/bookings" className="btn btn-outline btn-block btn-sm">
                View All Bookings &rarr;
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
