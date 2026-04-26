import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { User, Mail, Shield, Save, Edit3, Building } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            return alert('Passwords do not match');
        }

        setLoading(true);
        try {
            const { data } = await API.put('/auth/profile', formData);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto' }} className="fade-in">
            <div className="glass" style={{ padding: '50px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 className="glow-text" style={{ fontSize: '32px' }}>Account Settings</h1>
                    {!isEditing && (
                        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                            <Edit3 size={18} /> Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        {/* Name Field */}
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
                                <User size={16} /> Full Name
                            </label>
                            <input 
                                className="form-input" 
                                disabled={!isEditing}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                style={{ opacity: isEditing ? 1 : 0.7 }}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
                                <Mail size={16} /> Email Address
                            </label>
                            <input 
                                className="form-input" 
                                disabled={!isEditing}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                style={{ opacity: isEditing ? 1 : 0.7 }}
                            />
                        </div>

                        {/* Role View (Non-editable) */}
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                <Shield size={16} /> Account Role
                            </label>
                            <div className="form-input" style={{ opacity: 0.5, textTransform: 'capitalize', display: 'flex', alignItems: 'center' }}>
                                {user.role}
                            </div>
                        </div>

                        {/* Society Field (For Admins) */}
                        {user.role === 'admin' && (
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
                                    <Building size={16} /> Society / Club
                                </label>
                                <div className="form-input" style={{ opacity: 0.8, color: 'var(--accent-color)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    {user.society || 'Not Assigned'}
                                </div>
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}
                        >
                            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Change Password (Optional)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input 
                                        className="form-input" 
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input 
                                        className="form-input" 
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                                    <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </form>
            </div>
        </div>
    );
};

// Simple motion proxy to avoid import errors if framer-motion isn't fully loaded
const motion = {
    div: ({ children, style, initial, animate }) => <div style={style}>{children}</div>
};

export default Profile;
