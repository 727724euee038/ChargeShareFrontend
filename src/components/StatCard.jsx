import React from 'react';

const StatCard = ({ title, value, desc, icon }) => {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="stat-title">{title}</span>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
      </div>
      <div className="stat-value">{value}</div>
      {desc && <div className="stat-desc">{desc}</div>}
    </div>
  );
};

export default StatCard;
