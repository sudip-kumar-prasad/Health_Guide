import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import authImage from '../assets/login-illustration.png';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            // Handle error safely
            const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
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
                    <h2 className="page-title" style={{ textAlign: 'center' }}>Welcome Back</h2>
                    <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        Login to access your health history
                    </p>

                    {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
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
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Get Started</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
