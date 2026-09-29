import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsersPage = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data && res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load registered users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}"? This will also remove their chargers and bookings.`)) {
      return;
    }

    try {
      setMessage('');
      setError('');
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data && res.data.success) {
        setMessage(`User "${userName}" and associated data deleted successfully.`);
        fetchUsers();
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError(err.response?.data?.message || 'Could not delete user.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Registered Users</h1>
          <p className="page-subtitle">Inspect user accounts, assign roles, or remove inappropriate users</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
          &larr; Admin Dashboard
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>All Users ({users.length})</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading users...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Platform Role</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                      {u._id === currentAdmin?._id && (
                        <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: 'var(--primary-hover)', fontWeight: '700' }}>
                          (You)
                        </span>
                      )}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className={`role-tag role-${u.role}`}>
                        {u.role === 'user' ? 'EV User' : u.role === 'seller' ? 'Host' : 'Admin'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u._id !== currentAdmin?._id ? (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Current Admin</span>
                      )}
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

export default ManageUsersPage;
