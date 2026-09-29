import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManageChargersPage = () => {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchChargers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/chargers');
      if (res.data && res.data.success) {
        setChargers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin chargers:', err);
      setError('Failed to load charger listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Admin: Remove listing "${title}"? This will also remove any related bookings.`)) {
      return;
    }

    try {
      setMessage('');
      setError('');
      const res = await api.delete(`/admin/chargers/${id}`);
      if (res.data && res.data.success) {
        setMessage(`Charger listing "${title}" was removed.`);
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
          <h1 className="page-title">Manage Charger Listings</h1>
          <p className="page-subtitle">Audit and moderate all residential EV chargers registered on the platform</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
          &larr; Admin Dashboard
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Platform Chargers ({chargers.length})</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading chargers...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Charger Title</th>
                  <th>Host Details</th>
                  <th>Type & Speed</th>
                  <th>Location</th>
                  <th>Tariff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {chargers.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong>{c.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Hours: {c.startTime} - {c.endTime}
                      </div>
                    </td>
                    <td>
                      <div>{c.owner?.name || 'Unknown Host'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {c.owner?.email}
                      </div>
                    </td>
                    <td>
                      <span className="charger-type-pill" style={{ marginRight: '4px' }}>
                        {c.chargerType}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{c.chargingSpeed}</span>
                    </td>
                    <td>{c.location}</td>
                    <td>
                      <strong style={{ color: 'var(--primary-hover)' }}>₹{c.pricePerHour}</strong> / hr
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/chargers/${c._id}`} className="btn btn-outline btn-sm">
                          View
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
    </div>
  );
};

export default ManageChargersPage;
