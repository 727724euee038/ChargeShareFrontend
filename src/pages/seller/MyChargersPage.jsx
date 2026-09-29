import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MyChargersPage = () => {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchChargers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chargers/my-chargers');
      if (res.data && res.data.success) {
        setChargers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching my chargers:', err);
      setError('Could not load your chargers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove listing "${title}"?`)) {
      return;
    }

    try {
      setError('');
      setMessage('');
      const res = await api.delete(`/chargers/${id}`);
      if (res.data && res.data.success) {
        setMessage('Charger listing deleted successfully.');
        fetchChargers();
      }
    } catch (err) {
      console.error('Delete charger error:', err);
      setError(err.response?.data?.message || 'Could not delete charger listing.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Listed Chargers</h1>
          <p className="page-subtitle">Manage your charging stations, update availability, or edit pricing</p>
        </div>
        <Link to="/seller/add-charger" className="btn btn-primary">
          + Add New Charger
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Loading your charger listings...
        </div>
      ) : chargers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔌</div>
          <h3 style={{ color: 'var(--secondary)' }}>No chargers listed yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
            List your residential EV charger to start earning from nearby EV owners.
          </p>
          <Link to="/seller/add-charger" className="btn btn-primary btn-sm">
            List Your First Charger
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Charger Title</th>
                <th>Type & Speed</th>
                <th>Location</th>
                <th>Rate</th>
                <th>Operating Hours</th>
                <th>Available Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chargers.map((c) => (
                <tr key={c._id}>
                  <td>
                    <strong>{c.title}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Phone: {c.contactPhone}
                    </div>
                  </td>
                  <td>
                    <span className="charger-type-pill" style={{ marginRight: '6px' }}>
                      {c.chargerType}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: '600' }}>{c.chargingSpeed}</span>
                  </td>
                  <td>{c.location}</td>
                  <td>
                    <strong style={{ color: 'var(--primary-hover)' }}>₹{c.pricePerHour}</strong> / hr
                  </td>
                  <td>
                    {c.startTime} - {c.endTime}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {c.availableDays?.length === 7 ? 'Everyday' : c.availableDays?.join(', ')}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/chargers/${c._id}`} className="btn btn-outline btn-sm">
                        View
                      </Link>
                      <Link to={`/seller/edit-charger/${c._id}`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id, c.title)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
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

export default MyChargersPage;
