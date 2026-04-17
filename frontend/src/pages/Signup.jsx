import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import authImage from '../assets/signup-illustration.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'Prefer not to say',
        phone: ''
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const { register, verifyOTP, resendOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const data = await register(formData);
            setSuccess(data.message);
            setRegisteredEmail(data.email || formData.email);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await verifyOTP(registeredEmail, otp);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Verification failed. Invalid or expired OTP.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await resendOTP(registeredEmail);
            setSuccess(data.message);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to resend OTP.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                {/* Image Side */}
                <div
                    className="auth-image-side"
                    style={{ backgroundImage: `url(${authImage})` }}
                ></div>

                {/* Form Side */}
                <div className="auth-form-side">
                    <h2 className="page-title" style={{ textAlign: 'center' }}>Get Started</h2>
                    <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        Start your professional health journey
                    </p>

                    {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

                    {success ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ 
                                width: '60px', 
                                height: '60px', 
                                background: '#DCFCE7', 
                                color: '#166534', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '2rem',
                                margin: '0 auto 1.5rem'
                            }}>
                                ✉️
                            </div>
                            <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Verify Your Email</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '2rem' }}>{success}</p>
                            
                            <form onSubmit={handleVerifyOTP}>
                                <div className="form-group">
                                    <label className="form-label" style={{ textAlign: 'left' }}>Enter 6-Digit Code</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 'bold' }}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '1rem' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </button>
                            </form>
                            
                            <p style={{ marginTop: '1.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                Didn't receive the code?{' '}
                                <button 
                                    onClick={handleResendOTP}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: 'var(--primary)', 
                                        cursor: 'pointer', 
                                        fontWeight: '600',
                                        padding: 0
                                    }}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Age</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Gender</label>
                                        <select
                                            className="form-input"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                            <option>Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    disabled={loading}
                                >
                                    {loading && (
                                        <span style={{
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            width: '16px',
                                            height: '16px',
                                            animation: 'spin 0.8s linear infinite',
                                            display: 'inline-block'
                                        }}></span>
                                    )}
                                    {loading ? 'Creating Account...' : 'Get Started'}
                                </button>
                            </form>
                            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;
