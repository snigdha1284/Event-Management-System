import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event, onRegister }) => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = eventDate < today;
    
    const isFull = event.registeredCount >= event.capacity;
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    
    const isRegistrationDisabled = isFull || isPast;
    const buttonText = isPast ? 'Past Event' : (isFull ? 'Sold Out' : 'Register Now');
    const badgeText = isPast ? 'Completed' : (isFull ? 'Sold Out' : 'Available');
    const badgeColor = isPast ? '#6B7280' : (isFull ? '#ff4d4d' : 'var(--accent-color)');
    const badgeBg = isPast ? 'rgba(107, 114, 128, 0.1)' : (isFull ? 'rgba(255,0,0,0.1)' : 'rgba(228, 122, 6, 0.1)');

    return (
        <>
            <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass"
                style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                }}
                onClick={() => setShowModal(true)}
            >
                <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>{event.title}</h3>
                        <div style={{ 
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            background: badgeBg,
                            color: badgeColor,
                            fontSize: '12px',
                            fontWeight: 'bold',
                            border: `1px solid ${badgeColor}33`
                        }}>
                            {badgeText}
                        </div>
                    </div>

                    <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--text-muted)', 
                        marginBottom: '20px', 
                        height: '40px', 
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {event.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
                            <Calendar size={16} color="var(--accent-color)" />
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
                            <MapPin size={16} color="var(--accent-color)" />
                            {event.venue}
                        </div>
                        {isAdmin && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                <Users size={16} color="var(--accent-color)" />
                                {event.registeredCount} / {event.capacity} Registered
                            </div>
                        )}
                    </div>

                    {isAdmin && (
                        <div style={{ 
                            height: '6px', 
                            background: 'rgba(255,255,255,0.05)', 
                            borderRadius: '3px', 
                            marginBottom: '20px',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                width: `${(event.registeredCount / event.capacity) * 100}%`, 
                                height: '100%', 
                                background: 'var(--primary-color)'
                            }}></div>
                        </div>
                    )}

                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onRegister(event._id);
                        }}
                        disabled={isRegistrationDisabled}
                        className="btn btn-primary" 
                        style={{ width: '100%', opacity: isRegistrationDisabled ? 0.5 : 1 }}
                    >
                        {buttonText} {!isPast && <ArrowRight size={18} />}
                    </button>
                </div>
            </motion.div>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        background: 'transparent',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="glass"
                            style={{ 
                                width: '100%', 
                                maxWidth: '600px', 
                                padding: '40px',
                                position: 'relative',
                                background: 'var(--bg-color)',
                                border: '1px solid var(--accent-color)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={24} />
                            </button>

                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-color)', marginBottom: '10px' }}>{event.title}</h2>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                    <Calendar size={16} color="var(--accent-color)" />
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                    <MapPin size={16} color="var(--accent-color)" />
                                    {event.venue}
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '18px' }}>About this Event</h4>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                                    {event.description}
                                </p>
                            </div>

                            {isAdmin && (
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span>Registration Progress</span>
                                        <span style={{ color: 'var(--accent-color)' }}>{event.registeredCount} / {event.capacity}</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            width: `${(event.registeredCount / event.capacity) * 100}%`, 
                                            height: '100%', 
                                            background: 'var(--primary-color)'
                                        }}></div>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={() => {
                                    onRegister(event._id);
                                    setShowModal(false);
                                }}
                                disabled={isRegistrationDisabled}
                                className="btn btn-primary" 
                                style={{ width: '100%', height: '55px', fontSize: '18px', opacity: isRegistrationDisabled ? 0.5 : 1 }}
                            >
                                {buttonText} {!isPast && <ArrowRight size={20} />}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EventCard;
