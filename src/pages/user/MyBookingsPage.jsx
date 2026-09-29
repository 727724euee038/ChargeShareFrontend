import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings');
      if (res.data && res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setErrorMessage('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) {
      return;
    }

    try {
      setErrorMessage('');
      setActionMessage('');
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data && res.data.success) {
        setActionMessage('Booking request has been cancelled.');
        fetchBookings();
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setErrorMessage(err.response?.data?.message || 'Could not cancel booking.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Track your EV charging reservations and status updates</p>
        </div>
        <Link to="/chargers" className="btn btn-primary btn-sm">
          + Book Another Charger
        </Link>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab} {tab === 'all' ? `(${bookings.length})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Loading your reservations...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚗</div>
          <h3 style={{ color: 'var(--secondary)' }}>No {filter !== 'all' ? filter : ''} bookings found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
            Browse verified peer-to-peer home chargers and request a charging slot.
          </p>
          <Link to="/chargers" className="btn btn-primary btn-sm">
            Browse Chargers
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Charger Listing</th>
                <th>Location & Host</th>
                <th>Date & Time</th>
                <th>Duration & Cost</th>
                <th>Vehicle / Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <strong>{booking.charger?.title || 'Home Charger'}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {booking.charger?.chargerType} &bull; {booking.charger?.chargingSpeed}
                    </div>
                  </td>
                  <td>
                    <div>{booking.charger?.location}</div>
                    {booking.charger?.owner && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Host: {booking.charger.owner.name} ({booking.charger.owner.phone})
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{booking.bookingDate}</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </td>
                  <td>
                    <div>{booking.totalHours} hrs</div>
                    <strong style={{ color: 'var(--primary-hover)', fontSize: '0.95rem' }}>
                      ₹{booking.totalAmount}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{booking.vehicleInfo || '—'}</div>
                    {booking.notes && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        "{booking.notes}"
                      </div>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                  <td>
                    {booking.status === 'Pending' ? (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
