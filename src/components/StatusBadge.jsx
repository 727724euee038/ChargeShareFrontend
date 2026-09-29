import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();
  let badgeClass = 'badge-pending';

  switch (normalized) {
    case 'accepted':
      badgeClass = 'badge-accepted';
      break;
    case 'rejected':
      badgeClass = 'badge-rejected';
      break;
    case 'cancelled':
      badgeClass = 'badge-cancelled';
      break;
    case 'completed':
      badgeClass = 'badge-completed';
      break;
    default:
      badgeClass = 'badge-pending';
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;
