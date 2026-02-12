import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaShieldAlt,
    FaEdit,
    FaCheckCircle,
    FaHeartbeat,
    FaFileMedical,
    FaLock,
    FaSignOutAlt,
    FaCamera
} from 'react-icons/fa';

/**
 * Profile Component
 * Purpose: A premium, modern user dashboard for managing personal information,
 * health stats, and account security.
 */
const Profile = () => {
    const { user, logout, updateUserProfile, changePassword } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    // Password Change State
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setShowPasswordChange(false), 2000);
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    // Mock stats for visual flair
    const stats = [
        { label: 'Appointments Booked', value: '12', icon: <FaCalendarAlt />, color: '#0ea5e9' },
        { label: 'Health Reports', value: '5', icon: <FaFileMedical />, color: '#10b981' },
        { label: 'Health Score', value: '88', icon: <FaHeartbeat />, color: '#ef4444' },
    ];

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-light)' }}>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>

            {/* 1. HERO SECTION */}
            <div className="glass-panel" style={{
                borderRadius: '24px',
                padding: '3rem 2rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)'
            }}>
                {/* Decorative background element */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
                    zIndex: -1
                }} />

                {/* Avatar Area */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #1e3a8a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3.5rem',
                        color: 'white',
                        boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)',
                        border: '4px solid white'
                    }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <button style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                        background: 'white',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#1e3a8a',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        <FaCamera size={14} />
                    </button>
                </div>

                {/* User Intro */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '2.2rem', margin: 0, color: '#1e3a8a', fontWeight: '800' }}>{user.name}</h1>
                        <span style={{
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}>
                            <FaCheckCircle /> Verified Member
                        </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '0 0 1.5rem 0' }}>{user.email}</p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => {
                                if (isEditing) {
                                    handleSave();
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                            disabled={loading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#1e3a8a',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                fontWeight: '700',
                                transition: 'all 0.2s',
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            <FaEdit /> {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
                        </button>
                        <button
                            onClick={logout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'white',
                                color: '#ef4444',
                                border: '1px solid #fee2e2',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                fontWeight: '700'
                            }}
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. STATS GRID */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="card card-hover-effect" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: `${stat.color}15`,
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</p>
                            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b', fontWeight: '800' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. INFORMATION CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Personal Details */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#1e3a8a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaShieldAlt color="#0ea5e9" /> Personal Information
                    </h3>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaUser size={14} color="#94a3b8" /> Full Name
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                readOnly={!isEditing}
                                style={{ background: isEditing ? 'white' : '#f8fafc' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaEnvelope size={14} color="#94a3b8" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    defaultValue={user.email}
                                    readOnly={true} // Usually email is not edited directly
                                    style={{ background: '#f8fafc', color: '#94a3b8' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaPhone size={14} color="#94a3b8" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    readOnly={!isEditing}
                                    style={{ background: isEditing ? 'white' : '#f8fafc' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '1rem' }}>Account Security</h4>
                            <button
                                className="btn btn-outline"
                                style={{ display: 'flex', gap: '0.5rem', width: 'fit-content' }}
                                onClick={() => setShowPasswordChange(!showPasswordChange)}
                            >
                                <FaLock /> Change Password
                            </button>

                            {showPasswordChange && (
                                <form onSubmit={handlePasswordChange} style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
                                    {passwordMessage.text && (
                                        <div style={{
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                            background: passwordMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
                                            color: passwordMessage.type === 'error' ? '#991b1b' : '#166534',
                                            fontSize: '0.9rem'
                                        }}>
                                            {passwordMessage.text}
                                        </div>
                                    )}
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.9rem' }}>Current Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                            style={{ background: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.9rem' }}>New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            style={{ background: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.9rem' }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                            style={{ background: 'white' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                            disabled={passwordLoading}
                                        >
                                            {passwordLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordChange(false)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#64748b',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Completion / Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#1e3a8a' }}>Profile Strength</h4>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            border: '8px solid #f1f5f9',
                            borderTop: '8px solid #10b981',
                            margin: '0 auto 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            color: '#10b981'
                        }}>
                            85%
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Complete your medical history to reach 100%.</p>
                        <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', marginTop: '1rem' }}>
                            Complete Now
                        </button>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 1.2rem 0', color: '#1e3a8a', fontSize: '1rem' }}>Quick Actions</h4>
                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                            {['My Health History', 'Download Data', 'Privacy Settings'].map((action, i) => (
                                <button key={i} style={{
                                    textAlign: 'left',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.9rem',
                                    color: '#475569',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}>
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Tagline */}
            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <p>VitallQ Platform Security - Your data is encrypted and secure.</p>
            </div>

        </div>
    );
};

export default Profile;
