import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', society: '' });
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData);
            }
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1e293b 0%, #0B1220 100%)',
            padding: '20px'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass" 
                style={{ width: '100%', maxWidth: '450px', padding: '40px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        color: 'var(--accent-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <Lock size={24} /> {isLogin ? 'Login to EventHub' : 'Join EventHub'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Experience events with electric style</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Full Name:</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input 
                                    className="form-input" 
                                    style={{ paddingLeft: '40px' }}
                                    type="text" 
                                    placeholder="Enter your name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Email:</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input 
                                className="form-input" 
                                style={{ paddingLeft: '40px' }}
                                type="email" 
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Password:</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input 
                                className="form-input" 
                                style={{ paddingLeft: '40px' }}
                                type="password" 
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>I am a...</label>
                            <select 
                                className="form-input"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="student">Student / Participant</option>
                                <option value="admin">Event Organizer (Admin)</option>
                            </select>
                        </div>
                    )}

                    {!isLogin && formData.role === 'admin' && (
                        <div className="form-group fade-in">
                            <label style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Society Name:</label>
                            <input 
                                className="form-input" 
                                type="text" 
                                placeholder="e.g. KSAC, Music Club..."
                                required
                                value={formData.society}
                                onChange={(e) => setFormData({...formData, society: e.target.value})}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>
                                Note: Each society can only have one administrator.
                            </p>
                        </div>
                    )}

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px', height: '50px' }}>
                        {isLogin ? 'Sign In' : 'Create Account'} <LogIn size={20} />
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: 'var(--accent-color)', 
                                fontWeight: 'bold', 
                                marginLeft: '5px', 
                                cursor: 'pointer' 
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
