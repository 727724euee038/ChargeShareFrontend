import React from 'react';
import { Link } from 'react-router-dom';

const ChargerCard = ({ charger }) => {
  return (
    <div className="charger-card">
      <div>
        <div className="charger-card-header">
          <h3 className="charger-title">{charger.title}</h3>
          <span className="charger-type-pill">{charger.chargerType}</span>
        </div>

        <div className="charger-location">
          <span>📍</span>
          <span>{charger.location}</span>
        </div>

        <div className="charger-specs">
          <div className="spec-item">
            Speed: <strong>{charger.chargingSpeed}</strong>
          </div>
          <div className="spec-item">
            Hours: <strong>{charger.startTime} - {charger.endTime}</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
          {charger.description.length > 90
            ? charger.description.substring(0, 90) + '...'
            : charger.description}
        </p>
      </div>

      <div className="charger-card-footer">
        <div className="price-container">
          <span className="price-val">₹{charger.pricePerHour}</span>
          <span className="price-unit">per hour</span>
        </div>
        <Link to={`/chargers/${charger._id}`} className="btn btn-primary btn-sm">
          View & Book
        </Link>
      </div>
    </div>
  );
};

export default ChargerCard;
