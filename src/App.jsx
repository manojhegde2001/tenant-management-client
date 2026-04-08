import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Sites from './pages/Sites';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-background text-text-main">
    <Navbar />
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
            <Route path="/roles" element={<MainLayout><Roles /></MainLayout>} />
            <Route path="/sites" element={<MainLayout><Sites /></MainLayout>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
