import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bookings');
      if (res.data && res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Admin: Remove this booking record from the platform?')) {
      return;
    }

    try {
      setMessage('');
      setError('');
      const res = await api.delete(`/admin/bookings/${id}`);
      if (res.data && res.data.success) {
        setMessage('Booking record removed.');
        fetchBookings();
      }
    } catch (err) {
      console.error('Delete booking error:', err);
      setError(err.response?.data?.message || 'Could not delete booking record.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage All Bookings</h1>
          <p className="page-subtitle">Inspect reservations, verify conflict-resolution, and moderate booking records</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
          &larr; Admin Dashboard
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>All Platform Bookings ({bookings.length})</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading bookings...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Charger</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.user?.name || 'EV Driver'}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {b.user?.phone} &bull; {b.user?.email}
                      </div>
                    </td>
                    <td>
                      <strong>{b.charger?.title || 'Charger'}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {b.charger?.location}
                      </div>
                    </td>
                    <td>
                      <strong>{b.bookingDate}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {b.startTime} - {b.endTime}
                      </div>
                    </td>
                    <td>{b.totalHours} hrs</td>
                    <td>
                      <strong style={{ color: 'var(--primary-hover)' }}>₹{b.totalAmount}</strong>
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
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

export default ManageBookingsPage;
