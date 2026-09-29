import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AddChargerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [chargerType, setChargerType] = useState('Type 2 (AC)');
  const [chargingSpeed, setChargingSpeed] = useState('7.4 kW');
  const [pricePerHour, setPricePerHour] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('22:00');
  const [availableDays, setAvailableDays] = useState(DAYS_OF_WEEK);
  const [contactPhone, setContactPhone] = useState(user?.phone || '');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      const res = await api.post('/chargers', {
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
      console.error('Error creating charger:', err);
      setError(err.response?.data?.message || 'Failed to list charger.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">List a New EV Charger</h1>
          <p className="page-subtitle">Publish your home charging point to earn revenue from nearby EV drivers</p>
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
              placeholder="e.g. Koramangala 7.4kW Smart Wallbox"
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
              placeholder="e.g. 14th Main, 4th Block, Koramangala, Bengaluru"
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
                <option value="Type 2 (AC)">Type 2 (AC) - Most Common</option>
                <option value="CCS2 (DC Fast)">CCS2 (DC Fast)</option>
                <option value="GB/T (DC)">GB/T (DC)</option>
                <option value="16A 3-Pin Socket">16A 3-Pin Socket (Standard AC)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Power Output / Speed</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 7.4 kW, 11 kW, 22 kW"
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
                placeholder="e.g. 120"
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
                placeholder="e.g. +91 98765 12345"
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

          {/* Operating Days */}
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
              placeholder="Describe access to charger (e.g. gate code, covered porch, CCTV, parking space, Wi-Fi access)..."
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
            {submitting ? 'Publishing Charger...' : 'Publish Charger Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChargerPage;
