import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ChargerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();

  const [charger, setCharger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [notes, setNotes] = useState('');

  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchCharger = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/chargers/${id}`);
        if (res.data && res.data.success) {
          setCharger(res.data.data);
          // Set initial times within operating hours if available
          if (res.data.data.startTime) setStartTime(res.data.data.startTime);
        }
      } catch (err) {
        console.error('Error fetching charger:', err);
        setError('Failed to load charger details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCharger();
  }, [id]);

  // Real-time calculation of duration and total cost
  const calculateBookingDetails = () => {
    if (!startTime || !endTime || !charger) return { hours: 0, total: 0, valid: false };

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    if (endMinutes <= startMinutes) {
      return { hours: 0, total: 0, valid: false, error: 'End time must be after start time' };
    }

    const durationHours = parseFloat(((endMinutes - startMinutes) / 60).toFixed(2));
    const totalAmount = Math.round(durationHours * charger.pricePerHour);

    return { hours: durationHours, total: totalAmount, valid: true };
  };

  const bookingDetails = calculateBookingDetails();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!bookingDetails.valid) {
      setBookingError(bookingDetails.error || 'Please enter valid start and end times.');
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await api.post('/bookings', {
        chargerId: charger._id,
        bookingDate,
        startTime,
        endTime,
        vehicleInfo,
        notes,
      });

      if (res.data && res.data.success) {
        setBookingSuccess('Booking request sent successfully! The host has been notified.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      const msg = err.response?.data?.message || 'Could not place booking. Please check slot availability.';
      setBookingError(msg);
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading charger details...</p>
      </div>
    );
  }

  if (error || !charger) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error || 'Charger not found.'}</div>
        <Link to="/chargers" className="btn btn-outline btn-sm">
          &larr; Back to Chargers
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/chargers" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &larr; Back to all chargers
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Charger Information */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>{charger.title}</h1>
            <span className="charger-type-pill">{charger.chargerType}</span>
          </div>

          <div className="charger-location" style={{ fontSize: '0.95rem' }}>
            <span>📍</span>
            <span>{charger.location}</span>
          </div>

          <div style={{ margin: '16px 0', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: '8px' }}>Description</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              {charger.description}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: '12px' }}>Technical & Operating Specs</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Charging Speed:</span>
                <p><strong>{charger.chargingSpeed}</strong></p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Tariff:</span>
                <p><strong style={{ color: 'var(--primary-hover)', fontSize: '1.1rem' }}>₹{charger.pricePerHour}</strong> / hour</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Operating Hours:</span>
                <p><strong>{charger.startTime} - {charger.endTime}</strong></p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Host Contact:</span>
                <p><strong>{charger.contactPhone}</strong></p>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Available Days:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {charger.availableDays.map((day) => (
                  <span
                    key={day}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                    }}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {charger.owner && (
              <div style={{ marginTop: '16px', background: 'var(--bg-subtle)', padding: '12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Listing Host:</span>
                <p style={{ fontWeight: '600', color: 'var(--secondary)' }}>{charger.owner.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking Box */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>Book a Charging Slot</h2>
            <span style={{ fontWeight: '700', color: 'var(--primary-hover)', fontSize: '1.1rem' }}>
              ₹{charger.pricePerHour}/hr
            </span>
          </div>

          {!isAuthenticated ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.92rem' }}>
                Please log in with an EV User account to reserve this charger.
              </p>
              <Link to="/login" className="btn btn-primary btn-block">
                Login to Book
              </Link>
            </div>
          ) : role !== 'user' ? (
            <div className="alert alert-info" style={{ fontSize: '0.88rem' }}>
              You are logged in as a <strong>{role === 'seller' ? 'Host' : 'Admin'}</strong>. Booking requests can only be made by EV Users. Switch to an EV User account to book.
            </div>
          ) : bookingSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div className="alert alert-success">{bookingSuccess}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                Your request is now pending host confirmation.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/user/my-bookings" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  View My Bookings
                </Link>
                <button
                  onClick={() => {
                    setBookingSuccess('');
                    setBookingError('');
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Book Another Slot
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit}>
              {bookingError && <div className="alert alert-error">{bookingError}</div>}

              <div className="form-group">
                <label className="form-label">Booking Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time</label>
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
                <label className="form-label">Your Vehicle (Model / Plate)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Tata Nexon EV, MG ZS EV"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes for Host (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Will arrive with ~20% battery"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Price Calculation Box */}
              <div
                style={{
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  borderRadius: '6px',
                  padding: '14px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                  <span>Duration:</span>
                  <strong>{bookingDetails.hours} hrs</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                  <span>Rate:</span>
                  <span>₹{charger.pricePerHour}/hr</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--primary-border)',
                    paddingTop: '8px',
                    fontWeight: '700',
                    fontSize: '1.05rem',
                    color: 'var(--secondary)',
                  }}
                >
                  <span>Estimated Total:</span>
                  <span style={{ color: 'var(--primary-hover)' }}>₹{bookingDetails.total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingSubmitting || !bookingDetails.valid}
                className="btn btn-primary btn-block btn-lg"
              >
                {bookingSubmitting ? 'Sending Request...' : 'Send Booking Request'}
              </button>

              <div className="form-help" style={{ textAlign: 'center', marginTop: '10px' }}>
                Note: No upfront payment required. Host will review and confirm your slot.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChargerDetailsPage;
