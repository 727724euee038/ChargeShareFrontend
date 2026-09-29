import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [chargers, setChargers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [chargersRes, requestsRes] = await Promise.all([
        api.get('/chargers/my-chargers'),
        api.get('/bookings/seller-requests'),
      ]);

      if (chargersRes.data && chargersRes.data.success) {
        setChargers(chargersRes.data.data);
      }
      if (requestsRes.data && requestsRes.data.success) {
        setRequests(requestsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching seller dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      setActionError('');
      setActionSuccess('');
      const res = await api.put(`/bookings/${bookingId}/status`, { status });
      if (res.data && res.data.success) {
        setActionSuccess(`Booking request successfully marked as ${status}.`);
        fetchData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setActionError(err.response?.data?.message || 'Could not update booking status.');
    }
  };

  // Metrics
  const totalChargers = chargers.length;
  const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
  const acceptedBookings = requests.filter((r) => r.status === 'Accepted').length;
  const totalRevenue = requests
    .filter((r) => ['Accepted', 'Completed'].includes(r.status))
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Charger Host Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}! Manage your EV chargers and incoming driver requests.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/seller/add-charger" className="btn btn-primary btn-sm">
            + Add New Charger
          </Link>
          <Link to="/seller/my-chargers" className="btn btn-outline btn-sm">
            My Listings ({totalChargers})
          </Link>
        </div>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {actionError && <div className="alert alert-error">{actionError}</div>}

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard title="My Chargers" value={totalChargers} desc="Active listed chargers" icon="🔌" />
        <StatCard title="Pending Requests" value={pendingRequests} desc="Action required" icon="⏳" />
        <StatCard title="Confirmed Slots" value={acceptedBookings} desc="Upcoming accepted sessions" icon="✅" />
        <StatCard title="Est. Earnings" value={`₹${totalRevenue}`} desc="From accepted sessions" icon="💰" />
      </div>

      {/* Pending Requests Alert Box */}
      {pendingRequests > 0 && (
        <div
          className="card"
          style={{
            background: 'var(--warning-light)',
            borderColor: '#fcd34d',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <strong style={{ color: '#92400e', fontSize: '1rem' }}>
              ⚠️ You have {pendingRequests} pending booking request(s) waiting for your response!
            </strong>
            <p style={{ color: '#b45309', fontSize: '0.85rem', marginTop: '2px' }}>
              Review the requested dates and time slots below to confirm or decline.
            </p>
          </div>
          <Link to="/seller/booking-requests" className="btn btn-secondary btn-sm">
            View All Requests
          </Link>
        </div>
      )}

      {/* Incoming Requests Section */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>Recent Booking Requests</h2>
          <Link to="/seller/booking-requests" className="btn btn-outline btn-sm">
            Manage All ({requests.length})
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
            <p>No booking requests received yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Contact</th>
                  <th>Charger</th>
                  <th>Date & Time</th>
                  <th>Hours</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 6).map((req) => (
                  <tr key={req._id}>
                    <td>
                      <strong>{req.user?.name || 'EV Driver'}</strong>
                      {req.vehicleInfo && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {req.vehicleInfo}
                        </div>
                      )}
                    </td>
                    <td>{req.user?.phone || req.user?.email}</td>
                    <td>{req.charger?.title}</td>
                    <td>
                      <div>{req.bookingDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {req.startTime} - {req.endTime}
                      </div>
                    </td>
                    <td>{req.totalHours} hrs</td>
                    <td>
                      <strong style={{ color: 'var(--primary-hover)' }}>₹{req.totalAmount}</strong>
                    </td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td>
                      {req.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'Accepted')}
                            className="btn btn-primary btn-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          {req.status}
                        </span>
                      )}
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

export default SellerDashboard;
