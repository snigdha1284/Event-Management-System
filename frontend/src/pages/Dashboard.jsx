import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles, Calendar, Users, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ events: 0, members: 0, clubs: 0 });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await API.get('/events/public-stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const { data } = await API.get('/events');
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await API.post(`/events/${eventId}/register`);
            alert('Registered successfully!');
            fetchEvents(); // Refresh data
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(search.toLowerCase()) || 
        e.venue.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                marginBottom: '50px',
                background: 'linear-gradient(180deg, rgba(8, 28, 38, 0.5) 0%, transparent 100%)',
                borderRadius: '24px',
                position: 'relative'
            }}>
                <h1 className="glow-text" style={{ 
                    fontSize: '48px', 
                    fontWeight: '800', 
                    marginBottom: '20px',
                    color: 'var(--accent-color)'
                }}>
                    Welcome to Event Management System
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
                    Your one-stop platform for campus events, club activities, and community gatherings
                </p>
            </div>

            {/* Stats Section */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '30px', 
                marginBottom: '80px' 
            }}>
                <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                    <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <div style={{ 
                        fontSize: '40px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '10px' 
                    }}>{stats.events}</div>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', fontWeight: 'bold' }}>Events Hosted</div>
                </div>
                <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                    <Users size={48} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <div style={{ 
                        fontSize: '40px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '10px' 
                    }}>{stats.members}</div>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', fontWeight: 'bold' }}>Active Members</div>
                </div>
                <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                    <Trophy size={48} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <div style={{ 
                        fontSize: '40px', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '10px' 
                    }}>{stats.clubs}</div>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', fontWeight: 'bold' }}>Clubs</div>
                </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h2 className="glow-text" style={{ fontSize: '28px', marginBottom: '20px' }}>Upcoming Events</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            className="form-input" 
                            style={{ paddingLeft: '50px' }}
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <button className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
                    <Filter size={20} /> Filters
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="glow-text" style={{ fontSize: '24px' }}>Loading the magic...</div>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '30px' 
                }}>
                    {filteredEvents.map(event => (
                        <EventCard 
                            key={event._id} 
                            event={event} 
                            onRegister={handleRegister} 
                        />
                    ))}
                    {filteredEvents.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                            <Sparkles size={48} style={{ marginBottom: '20px' }} />
                            <p>No events found. Try a different search!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
