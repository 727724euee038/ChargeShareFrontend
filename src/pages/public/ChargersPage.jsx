import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ChargerCard from '../../components/ChargerCard';

const ChargersPage = () => {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [keyword, setKeyword] = useState('');
  const [chargerType, setChargerType] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchChargers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (chargerType && chargerType !== 'all') params.chargerType = chargerType;
      if (maxPrice && !isNaN(maxPrice)) params.maxPrice = maxPrice;

      const res = await api.get('/chargers', { params });
      if (res.data && res.data.success) {
        setChargers(res.data.data);
      }
    } catch (err) {
      console.error('Error loading chargers:', err);
      setError('Unable to load chargers at this time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, [chargerType]); // Re-fetch on type change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchChargers();
  };

  const handleReset = () => {
    setKeyword('');
    setChargerType('all');
    setMaxPrice('');
    // Trigger re-fetch
    setTimeout(() => {
      api.get('/chargers').then((res) => {
        if (res.data && res.data.success) setChargers(res.data.data);
      });
    }, 50);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore EV Chargers</h1>
          <p className="page-subtitle">Find and reserve private home charging points near your location</p>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing <strong>{chargers.length}</strong> available chargers
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-card">
        <form onSubmit={handleSearchSubmit} className="filter-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Location or Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Koramangala, Indiranagar, Fast Charger..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Charger Type</label>
            <select
              className="form-select"
              value={chargerType}
              onChange={(e) => setChargerType(e.target.value)}
            >
              <option value="all">All Charger Types</option>
              <option value="Type 2 (AC)">Type 2 (AC)</option>
              <option value="CCS2 (DC Fast)">CCS2 (DC Fast)</option>
              <option value="GB/T (DC)">GB/T (DC)</option>
              <option value="16A 3-Pin Socket">16A 3-Pin Socket</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Price (₹/hr)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="10"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Filter
            </button>
            <button type="button" onClick={handleReset} className="btn btn-outline">
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Error display */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Results grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Searching chargers...
        </div>
      ) : chargers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔌</div>
          <h3 style={{ color: 'var(--secondary)' }}>No chargers found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', marginBottom: '16px' }}>
            Try adjusting your search keyword, charger type, or maximum price filter.
          </p>
          <button onClick={handleReset} className="btn btn-primary btn-sm">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="chargers-grid">
          {chargers.map((charger) => (
            <ChargerCard key={charger._id} charger={charger} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChargersPage;
