import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    Settings, 
    PlusSquare,
    UserCircle
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const { user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['student', 'admin', 'superadmin'] },
        { name: 'Explore Events', icon: <Calendar size={20} />, path: '/events', roles: ['student', 'admin', 'superadmin'] },
        { name: 'My Registrations', icon: <UserCircle size={20} />, path: '/my-events', roles: ['student'] },
        { name: 'Create Event', icon: <PlusSquare size={20} />, path: '/create-event', roles: ['admin', 'superadmin'] },
        { name: 'Manage Users', icon: <Users size={20} />, path: '/users', roles: ['superadmin'] },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['student', 'admin', 'superadmin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className="glass" style={{
            position: 'fixed',
            left: '20px',
            top: '90px',
            bottom: '20px',
            width: '240px',
            padding: '20px 10px',
            zIndex: 900
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredItems.map((item, index) => (
                    <NavLink 
                        key={index}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 15px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'var(--text-muted)',
                            background: isActive ? 'rgba(30, 58, 138, 0.4)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
                            boxShadow: isActive ? 'var(--glow-shadow)' : 'none',
                            transition: 'all 0.3s ease'
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <span style={{ color: isActive ? 'var(--accent-color)' : 'var(--text-muted)' }}>{item.icon}</span>
                                <span style={{ fontWeight: '500' }}>{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
            
            <div style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '20px', 
                right: '20px',
                padding: '15px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
                <p style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '5px' }}>PRO TIP</p>
                <p style={{ fontSize: '11px', opacity: 0.8 }}>Hover over cards to see the electric glow effect!</p>
            </div>
        </aside>
    );
};

export default Sidebar;
