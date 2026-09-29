import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditChargerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [chargerType, setChargerType] = useState('Type 2 (AC)');
  const [chargingSpeed, setChargingSpeed] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('22:00');
  const [availableDays, setAvailableDays] = useState([]);
  const [contactPhone, setContactPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCharger = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/chargers/${id}`);
        if (res.data && res.data.success) {
          const c = res.data.data;
          setTitle(c.title);
          setDescription(c.description);
          setLocation(c.location);
          setChargerType(c.chargerType);
          setChargingSpeed(c.chargingSpeed);
          setPricePerHour(c.pricePerHour);
          setStartTime(c.startTime || '08:00');
          setEndTime(c.endTime || '22:00');
          setAvailableDays(c.availableDays || DAYS_OF_WEEK);
          setContactPhone(c.contactPhone);
        }
      } catch (err) {
        console.error('Error fetching charger for edit:', err);
        setError('Could not load charger details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCharger();
  }, [id]);

  const handleDayToggle = (day) => {
    if (availableDays.includes(day)) {
      if (availableDays.length === 1) {
        setError('At least one operational day must be selected.');
        return;
      }
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSelectAllDays = () => {
    setAvailableDays(DAYS_OF_WEEK);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(pricePerHour) <= 0) {
      setError('Please provide a positive hourly tariff.');
      return;
    }

    if (startTime >= endTime) {
      setError('Operating end time must be after start time.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.put(`/chargers/${id}`, {
        title,
        description,
        location,
        chargerType,
        chargingSpeed,
        pricePerHour: Number(pricePerHour),
        startTime,
        endTime,
        availableDays,
        contactPhone,
      });

      if (res.data && res.data.success) {
        navigate('/seller/my-chargers');
      }
    } catch (err) {
      console.error('Error updating charger:', err);
      setError(err.response?.data?.message || 'Failed to update charger.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading charger details...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Charger Listing</h1>
          <p className="page-subtitle">Update your charging station specifications, schedule, or pricing</p>
        </div>
        <Link to="/seller/my-chargers" className="btn btn-outline btn-sm">
          Cancel & Return
        </Link>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Charger Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address & Neighborhood</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Charger Connector Type</label>
              <select
                className="form-select"
                value={chargerType}
                onChange={(e) => setChargerType(e.target.value)}
                required
              >
                <option value="Type 2 (AC)">Type 2 (AC)</option>
                <option value="CCS2 (DC Fast)">CCS2 (DC Fast)</option>
                <option value="GB/T (DC)">GB/T (DC)</option>
                <option value="16A 3-Pin Socket">16A 3-Pin Socket</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Power Output / Speed</label>
              <input
                type="text"
                className="form-control"
                value={chargingSpeed}
                onChange={(e) => setChargingSpeed(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hourly Tariff (₹/hour)</label>
              <input
                type="number"
                className="form-control"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Operating Start Time</label>
              <input
                type="time"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operating End Time</label>
              <input
                type="time"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Available Days</label>
              <button
                type="button"
                onClick={handleSelectAllDays}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
              >
                Select All Days
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {isSelected ? '✓ ' : ''}{day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Access Instructions</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '16px' }}
          >
            {submitting ? 'Saving Changes...' : 'Update Charger Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditChargerPage;
