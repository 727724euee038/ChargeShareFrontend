import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ChargersPage from './pages/public/ChargersPage';
import ChargerDetailsPage from './pages/public/ChargerDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// EV User Pages
import UserDashboard from './pages/user/UserDashboard';
import MyBookingsPage from './pages/user/MyBookingsPage';

// Seller / Host Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import MyChargersPage from './pages/seller/MyChargersPage';
import AddChargerPage from './pages/seller/AddChargerPage';
import EditChargerPage from './pages/seller/EditChargerPage';
import BookingRequestsPage from './pages/seller/BookingRequestsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageChargersPage from './pages/admin/ManageChargersPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/chargers" element={<ChargersPage />} />
          <Route path="/chargers/:id" element={<ChargerDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* EV User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Seller / Host Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/my-chargers"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <MyChargersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/add-charger"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <AddChargerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/edit-charger/:id"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <EditChargerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/booking-requests"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <BookingRequestsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chargers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageChargersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--secondary)' }}>404</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Page not found</p>
                <Link to="/" className="btn btn-primary">
                  Return to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
