import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NewReport from './pages/NewReport';
import ReportReview from './pages/ReportReview';
import PatientDashboard from './pages/PatientDashboard';
import SaveReports from './pages/SaveReports';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/new-report" element={
              <ProtectedRoute>
                <NewReport />
              </ProtectedRoute>
            } />
            <Route path="/report/:reportId" element={
              <ProtectedRoute>
                <ReportReview />
              </ProtectedRoute>
            } />
            <Route path="/save-reports" element={
              <ProtectedRoute>
                <SaveReports />
              </ProtectedRoute>
            } />
            <Route path="/view/:token" element={<PatientDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;