import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
    Users, Calendar, Shield, Activity, 
    Settings, BarChart3, Trash2, UserCog, ClipboardList, LayoutDashboard
} from 'lucide-react';

const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, totalEvents: 0, totalRegistrations: 0, systemHealth: 'Optimal' });
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const { data } = await API.get('/admin/stats');
                setStats(data);
            } else if (activeTab === 'users') {
                const { data } = await API.get('/admin/users');
                setUsers(data);
            } else if (activeTab === 'events') {
                const { data } = await API.get('/events');
                setEvents(data);
            } else if (activeTab === 'registrations') {
                const { data } = await API.get('/admin/registrations');
                setRegistrations(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await API.patch(`/admin/users/${userId}/role`, { role: newRole });
            fetchData();
        } catch (error) {
            alert('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/admin/users/${userId}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await API.delete(`/admin/events/${eventId}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete event');
        }
    };

    const renderOverview = () => (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="glass" style={{ padding: '25px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '5px' }}>Total Users</p>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-color)' }}>{stats.totalUsers}</h3>
                </div>
                <div className="glass" style={{ padding: '25px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '5px' }}>Total Events</p>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-color)' }}>{stats.totalEvents}</h3>
                </div>
                <div className="glass" style={{ padding: '25px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '5px' }}>Total Registrations</p>
                    <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-color)' }}>{stats.totalRegistrations}</h3>
                </div>
                <div className="glass" style={{ padding: '25px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '5px' }}>System Health</p>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981' }}>{stats.systemHealth}</h3>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div className="glass" style={{ padding: '30px', cursor: 'pointer' }} onClick={() => setActiveTab('users')}>
                    <Users size={32} color="var(--accent-color)" style={{ marginBottom: '15px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>Manage Users</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Control permissions and system access</p>
                </div>
                <div className="glass" style={{ padding: '30px', cursor: 'pointer' }} onClick={() => setActiveTab('events')}>
                    <Calendar size={32} color="#10B981" style={{ marginBottom: '15px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>Events Overview</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Monitor and moderate all campus events</p>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="glass fade-in" style={{ padding: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Name</th>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Email</th>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Role</th>
                        <th style={{ padding: '15px', textAlign: 'right', color: 'var(--text-muted)' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px', fontWeight: '500' }}>{u.name}</td>
                            <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{u.email}</td>
                            <td style={{ padding: '15px' }}>
                                <span style={{ 
                                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', textTransform: 'capitalize' 
                                }}>{u.role}</span>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                <button 
                                    onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'student' : 'admin')}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginRight: '15px' }}
                                    title="Toggle Admin Role"
                                >
                                    <UserCog size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteUser(u._id)}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                    title="Delete User"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderEvents = () => (
        <div className="glass fade-in" style={{ padding: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Event Title</th>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Date</th>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Venue</th>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Created By</th>
                        <th style={{ padding: '15px', textAlign: 'right', color: 'var(--text-muted)' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(e => (
                        <tr key={e._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px', fontWeight: '500' }}>{e.title}</td>
                            <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{new Date(e.date).toLocaleDateString()}</td>
                            <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{e.venue}</td>
                            <td style={{ padding: '15px' }}>{e.createdBy?.name || 'Admin'}</td>
                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                <button 
                                    onClick={() => handleDeleteEvent(e._id)}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderRegistrations = () => (
        <div className="glass fade-in" style={{ padding: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>User Name</th>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Event Name</th>
                        <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map(r => (
                        <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px', fontWeight: '500' }}>{r.userName}</td>
                            <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{r.eventName}</td>
                            <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{new Date(r.eventDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '40px', minHeight: '80vh' }}>
            {/* Sidebar-style Navigation */}
            <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={activeTab === 'overview' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ justifyContent: 'flex-start', gap: '12px', width: '100%' }}
                >
                    <LayoutDashboard size={20} /> Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={activeTab === 'users' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ justifyContent: 'flex-start', gap: '12px', width: '100%' }}
                >
                    <Users size={20} /> Users
                </button>
                <button 
                    onClick={() => setActiveTab('events')}
                    className={activeTab === 'events' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ justifyContent: 'flex-start', gap: '12px', width: '100%' }}
                >
                    <Calendar size={20} /> Events
                </button>
                <button 
                    onClick={() => setActiveTab('registrations')}
                    className={activeTab === 'registrations' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ justifyContent: 'flex-start', gap: '12px', width: '100%' }}
                >
                    <ClipboardList size={20} /> Registrations
                </button>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 className="glow-text" style={{ fontSize: '32px', marginBottom: '10px', textTransform: 'capitalize' }}>
                        System {activeTab}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>You are viewing the {activeTab} section as a Super Admin.</p>
                </div>

                {loading ? (
                    <div style={{ padding: '100px', textAlign: 'center' }}>
                        <div className="glow-text">Synchronizing data...</div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'events' && renderEvents()}
                        {activeTab === 'registrations' && renderRegistrations()}
                    </>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
