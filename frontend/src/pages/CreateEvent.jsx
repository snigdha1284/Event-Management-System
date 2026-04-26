import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Info, Users, Image as ImageIcon, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        venue: '',
        capacity: 50,
        image: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/events', formData);
            alert('Event created successfully!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <div className="fade-in">
            <h1 className="glow-text" style={{ fontSize: '36px', marginBottom: '30px' }}>Create <span style={{ color: 'var(--accent-color)' }}>New Event</span></h1>
            
            <div className="glass" style={{ padding: '40px', maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Event Title</label>
                            <div style={{ position: 'relative' }}>
                                <Info size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="form-input" 
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="e.g. Annual Tech Symposium 2026"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Description</label>
                            <textarea 
                                className="form-input" 
                                style={{ minHeight: '120px', resize: 'vertical' }}
                                placeholder="Describe the event, what to expect, and any prerequisites..."
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Date & Time</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="form-input" 
                                    style={{ paddingLeft: '40px' }}
                                    type="datetime-local"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Venue</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="form-input" 
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="e.g. Main Auditorium"
                                    required
                                    value={formData.venue}
                                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Capacity</label>
                            <div style={{ position: 'relative' }}>
                                <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="form-input" 
                                    style={{ paddingLeft: '40px' }}
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <ImageIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="form-input" 
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '50px' }}>
                            Publish Event <Send size={20} />
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="btn btn-secondary" style={{ width: '150px' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
