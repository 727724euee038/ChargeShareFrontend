import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const BookingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/seller-requests');
      if (res.data && res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching booking requests:', err);
      setActionError('Could not load booking requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setActionError('');
      setActionSuccess('');
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        setActionSuccess(`Booking request was marked as ${newStatus}.`);
        fetchRequests();
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      setActionError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    return r.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Booking Requests</h1>
          <p className="page-subtitle">Review and approve EV drivers requesting to charge at your property</p>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Total Requests: <strong>{requests.length}</strong>
        </div>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {actionError && <div className="alert alert-error">{actionError}</div>}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'accepted', 'rejected', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab} {tab === 'all' ? `(${requests.length})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Loading requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📬</div>
          <h3 style={{ color: 'var(--secondary)' }}>No {filter !== 'all' ? filter : ''} requests found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            When EV drivers request charging slots on your chargers, they will show up here.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Driver Information</th>
                <th>Charger</th>
                <th>Booking Slot</th>
                <th>Duration & Est. Earnings</th>
                <th>Notes / Vehicle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id}>
                  <td>
                    <strong>{req.user?.name || 'EV Driver'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Phone: {req.user?.phone}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {req.user?.email}
                    </div>
                  </td>
                  <td>
                    <strong>{req.charger?.title || 'Charger Listing'}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {req.charger?.location}
                    </div>
                  </td>
                  <td>
                    <strong>{req.bookingDate}</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {req.startTime} - {req.endTime}
                    </div>
                  </td>
                  <td>
                    <div>{req.totalHours} hrs</div>
                    <strong style={{ color: 'var(--primary-hover)', fontSize: '1rem' }}>
                      ₹{req.totalAmount}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>Vehicle: {req.vehicleInfo || '—'}</div>
                    {req.notes && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        "{req.notes}"
                      </div>
                    )}
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
                    ) : req.status === 'Accepted' ? (
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'Completed')}
                        className="btn btn-outline btn-sm"
                        title="Mark session completed after driver has finished charging"
                      >
                        Complete
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

export default BookingRequestsPage;
