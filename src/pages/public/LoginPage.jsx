import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectByRole = (userRole) => {
    if (location.state?.from?.pathname) {
      navigate(location.state.from.pathname);
      return;
    }
    if (userRole === 'admin') navigate('/admin/dashboard');
    else if (userRole === 'seller') navigate('/seller/dashboard');
    else navigate('/user/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    try {
      setSubmitting(true);
      const user = await quickLogin(role);
      redirectByRole(user.role);
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed. Make sure database is seeded.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2rem', marginBottom: '6px' }}>⚡</div>
          <h2>Welcome Back</h2>
          <p>Login to your ChargeShare account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. arun.user@chargeshare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '10px' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Selector for Viva / Evaluation */}
        <div className="demo-login-box">
          <div className="demo-title">⚡ 1-Click Quick Demo Login</div>
          <div className="demo-buttons">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start' }}
            >
              🚗 <strong>EV User:</strong>&nbsp;Arun Patel (Tata Nexon EV)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('seller')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start' }}
            >
              🏠 <strong>Charger Host:</strong>&nbsp;Rajesh Kumar (Koramangala)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start' }}
            >
              🛡️ <strong>System Admin:</strong>&nbsp;Full Administration
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary-hover)', fontWeight: '600' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
