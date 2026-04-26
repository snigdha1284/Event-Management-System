import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

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
            fetchEvents();
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
            <div style={{ marginBottom: '40px' }}>
                <h1 className="glow-text" style={{ fontSize: '32px', marginBottom: '10px' }}>Explore Events</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Discover and register for the most exciting campus gatherings.</p>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            className="form-input" 
                            style={{ paddingLeft: '50px' }}
                            placeholder="Search by title, venue..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
                        <Filter size={20} /> Filters
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="glow-text" style={{ fontSize: '24px' }}>Loading events...</div>
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

export default Events;
