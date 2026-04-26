import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LayoutDashboard, Calendar, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 50px',
            borderRadius: '0',
            background: 'var(--bg-color)',
            borderBottom: '2px solid var(--nav-border)' /* Dark red border from screenshot */
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <NavLink to="/" style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                    color: isActive ? 'var(--accent-color)' : 'var(--text-main)', fontSize: '14px', fontWeight: '500'
                })}>
                    <LayoutDashboard size={18} /> Home
                </NavLink>
                <NavLink to="/events" style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                    color: isActive ? 'var(--accent-color)' : 'var(--text-main)', fontSize: '14px', fontWeight: '500'
                })}>
                    <Calendar size={18} /> Events
                </NavLink>
                {user && (
                    <>
                        <NavLink to="/profile" style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                            color: isActive ? 'var(--accent-color)' : 'var(--text-main)', fontSize: '14px', fontWeight: '500'
                        })}>
                            <User size={18} /> Profile
                        </NavLink>
                        {user.role === 'superadmin' ? (
                            <NavLink to="/superadmin" style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                                color: isActive ? 'var(--accent-color)' : 'var(--text-main)', fontSize: '14px', fontWeight: '500'
                            })}>
                                <Settings size={18} /> Super Admin
                            </NavLink>
                        ) : user.role === 'admin' ? (
                            <NavLink to="/club-admin" style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                                color: isActive ? 'var(--accent-color)' : 'var(--text-main)', fontSize: '14px', fontWeight: '500'
                            })}>
                                <Settings size={18} /> Club Admin
                            </NavLink>
                        ) : null}
                    </>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {user ? (
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', 
                        padding: '5px 15px', background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '20px', border: '1px solid var(--glass-border)'
                    }}>
                        <User size={16} color="var(--accent-color)" />
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
                        <button onClick={logout} style={{ 
                            background: 'none', border: 'none', color: '#ff4d4d', 
                            cursor: 'pointer', marginLeft: '10px', fontSize: '12px' 
                        }}>Logout</button>
                    </div>
                ) : (
                    <NavLink to="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
