import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import Events from './pages/Events';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ClubAdminDashboard from './pages/ClubAdminDashboard';

const ProtectedLayout = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'var(--bg-color)' 
        }}>
            <div className="glow-text" style={{ fontSize: '24px' }}>Waking up the system...</div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content" style={{ marginLeft: 0, padding: '100px 40px' }}>
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <div className="app-container">
                            <Navbar />
                            <main className="main-content" style={{ marginLeft: 0, padding: '100px 40px' }}>
                                <Dashboard />
                            </main>
                        </div>
                    } />
                    <Route path="/club-admin" element={
                        <ProtectedLayout>
                            <ClubAdminDashboard />
                        </ProtectedLayout>
                    } />
                    <Route path="/events" element={
                        <div className="app-container">
                            <Navbar />
                            <main className="main-content" style={{ marginLeft: 0, padding: '100px 40px' }}>
                                <Events />
                            </main>
                        </div>
                    } />
                    <Route path="/profile" element={
                        <ProtectedLayout>
                            <Profile />
                        </ProtectedLayout>
                    } />
                    <Route path="/superadmin" element={
                        <ProtectedLayout>
                            <SuperAdminDashboard />
                        </ProtectedLayout>
                    } />
                    <Route path="/my-events" element={
                        <ProtectedLayout>
                            <MyEvents />
                        </ProtectedLayout>
                    } />
                    {/* Placeholder for other routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
