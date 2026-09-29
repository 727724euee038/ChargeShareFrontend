import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        if (res.data && res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching user bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Compute metrics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const acceptedBookings = bookings.filter((b) => b.status === 'Accepted').length;
  const completedBookings = bookings.filter((b) => b.status === 'Completed').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">EV Driver Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}! Track and manage your home charger reservations.</p>
        </div>
        <Link to="/chargers" className="btn btn-primary">
          ⚡ Find a Charger
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard title="Total Bookings" value={totalBookings} desc="All-time charging sessions" icon="📋" />
        <StatCard title="Pending Requests" value={pendingBookings} desc="Awaiting host approval" icon="⏳" />
        <StatCard title="Confirmed Slots" value={acceptedBookings} desc="Accepted upcoming sessions" icon="✅" />
        <StatCard title="Completed" value={completedBookings} desc="Past charged sessions" icon="🚗" />
      </div>

      {/* Quick Action Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(to right, #ecfdf5, #ffffff)',
          borderColor: 'var(--primary-border)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '4px' }}>Planning your next trip?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Book residential EV chargers ahead of time to ensure zero waiting time and guaranteed charging.
          </p>
        </div>
        <Link to="/chargers" className="btn btn-primary btn-sm">
          Browse Nearby Chargers
        </Link>
      </div>

      {/* Recent Bookings Section */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>Recent Bookings</h2>
          <Link to="/user/my-bookings" className="btn btn-outline btn-sm">
            View All ({bookings.length})
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading your bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '14px' }}>You haven't requested any charging slots yet.</p>
            <Link to="/chargers" className="btn btn-primary btn-sm">
              Discover Available Chargers
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Charger</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Est. Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.charger?.title || 'Charger Listing'}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Type: {booking.charger?.chargerType}
                      </div>
                    </td>
                    <td>{booking.charger?.location}</td>
                    <td>
                      <div>{booking.bookingDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </td>
                    <td>{booking.totalHours} hrs</td>
                    <td>
                      <strong style={{ color: 'var(--primary-hover)' }}>₹{booking.totalAmount}</strong>
                    </td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
