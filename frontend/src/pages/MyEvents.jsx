import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import EventCard from '../components/EventCard';
import { Bookmark, Calendar } from 'lucide-react';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const { data } = await API.get('/events/registered');
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching my events:', error);
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '40px' }}>
                <h1 className="glow-text" style={{ fontSize: '36px', marginBottom: '10px' }}>
                    My <span style={{ color: 'var(--accent-color)' }}>Journeys</span>
                </h1>
                <p style={{ opacity: 0.7, fontSize: '18px' }}>Events you're registered for.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="glow-text" style={{ fontSize: '24px' }}>Loading your events...</div>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '30px' 
                }}>
                    {events.map(event => (
                        <EventCard 
                            key={event._id} 
                            event={event} 
                            onRegister={() => alert('Already registered!')} 
                        />
                    ))}
                    {events.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                            <Bookmark size={48} style={{ marginBottom: '20px' }} />
                            <p>You haven't registered for any events yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyEvents;
