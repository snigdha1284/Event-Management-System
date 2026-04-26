import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
    Calendar, Users, PlusCircle, LayoutDashboard, 
    Trash2, Edit3, Eye, ArrowRight, X, Check, UserMinus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClubAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', venue: '', capacity: 50 });

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/events/my-events');
            setMyEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching my events:', error);
            setLoading(false);
        }
    };

    const fetchParticipants = async (eventId) => {
        try {
            const { data } = await API.get(`/events/${eventId}/participants`);
            setParticipants(data);
            setActiveTab('participants');
        } catch (error) {
            alert('Error fetching participants');
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await API.post('/events', formData);
            setShowCreateModal(false);
            fetchMyEvents();
            alert('Event created successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Creation failed');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await API.delete(`/events/${id}`);
            fetchMyEvents();
        } catch (error) {
            alert('Deletion failed');
        }
    };

    const totalRegistrations = myEvents.reduce((acc, curr) => acc + curr.registeredCount, 0);

    const renderDashboard = () => (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="glass" style={{ padding: '30px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>Total Events Created</p>
                    <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent-color)' }}>{myEvents.length}</h3>
                </div>
                <div className="glass" style={{ padding: '30px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>Total Registrations</p>
                    <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent-color)' }}>{totalRegistrations}</h3>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ fontSize: '24px' }}>My Events</h2>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <PlusCircle size={18} /> Create New Event
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {myEvents.map(event => (
                    <div key={event._id} className="glass" style={{ padding: '20px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{event.title}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={14} color="var(--accent-color)" /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={14} color="var(--accent-color)" /> {event.registeredCount} / {event.capacity} Joined
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px' }} onClick={() => {
                                setSelectedEvent(event);
                                fetchParticipants(event._id);
                            }}>
                                <Eye size={14} /> Participants
                            </button>
                            <button className="btn btn-secondary" style={{ color: '#ff4d4d', padding: '8px' }} onClick={() => handleDeleteEvent(event._id)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderParticipants = () => (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>← Back</button>
                <h2 style={{ fontSize: '24px' }}>Attendees: {selectedEvent?.title}</h2>
            </div>
            
            <div className="glass" style={{ padding: '30px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Name</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Email</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', fontWeight: '500' }}>{p.userId?.name}</td>
                                <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{p.userId?.email}</td>
                                <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{new Date(p.registrationDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {participants.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ padding: '50px', textAlign: 'center', opacity: 0.5 }}>No one has registered yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '40px' }}>
            {/* Admin Sidebar */}
            <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={activeTab === 'dashboard' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ justifyContent: 'flex-start', gap: '12px' }}
                >
                    <LayoutDashboard size={20} /> Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('events')}
                    className={activeTab === 'events' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ justifyContent: 'flex-start', gap: '12px' }}
                >
                    <Calendar size={20} /> My Events
                </button>
                <button 
                    onClick={() => {
                        if (selectedEvent) setActiveTab('participants');
                        else alert('Please select an event from the Dashboard first to view participants.');
                    }}
                    className={activeTab === 'participants' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ justifyContent: 'flex-start', gap: '12px' }}
                >
                    <Users size={20} /> Participants
                </button>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 className="glow-text" style={{ fontSize: '32px', marginBottom: '10px' }}>Club Admin Panel</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your events and track attendee activity.</p>
                </div>

                {activeTab === 'dashboard' || activeTab === 'events' ? renderDashboard() : renderParticipants()}
            </div>

            {/* Create Event Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)'
                    }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative' }}
                        >
                            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                            <h2 style={{ fontSize: '28px', color: 'var(--accent-color)', marginBottom: '30px' }}>Create Event</h2>
                            <form onSubmit={handleCreateEvent}>
                                <div className="form-group">
                                    <label>Event Title</label>
                                    <input className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Venue</label>
                                    <input className="form-input" required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <input type="number" className="form-input" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-input" style={{ height: '100px' }} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Create Event</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClubAdminDashboard;
