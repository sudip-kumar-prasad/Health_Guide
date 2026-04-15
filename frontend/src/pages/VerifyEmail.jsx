import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { API_URL } from '../config';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(response.data.message);
                // Redirect to login after 3 seconds
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh' 
        }}>
            <div className="glass-panel" style={{ 
                padding: '3rem', 
                textAlign: 'center', 
                maxWidth: '500px', 
                width: '100%',
                borderRadius: '1.5rem'
            }}>
                {status === 'verifying' && (
                    <>
                        <FaSpinner className="animate-spin" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }} />
                        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Verifying your email...</h2>
                        <p style={{ color: 'var(--text-light)' }}>Please wait while we confirm your account.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <FaCheckCircle style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1.5rem' }} />
                        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Email Verified!</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>{message}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Redirecting you to login...</p>
                        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                            Go to Login
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <FaExclamationCircle style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '1.5rem' }} />
                        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Verification Failed</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>{message}</p>
                        <Link to="/signup" className="btn btn-primary" style={{ display: 'inline-block' }}>
                            Try Registering Again
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
