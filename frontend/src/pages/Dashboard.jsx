import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    FaHeartbeat,
    FaHistory,
    FaChartLine,
    FaUser,
    FaStethoscope,
    FaSearch,
    FaCalendarAlt,
    FaPills,
    FaClipboardList,
    FaArrowRight,
    FaUserMd,
    FaChartBar
} from 'react-icons/fa';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [wellnessLog, setWellnessLog] = useState(null);
    const [mood, setMood] = useState(3);
    const [energy, setEnergy] = useState(3);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [historyRes, analyticsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/symptoms/history`, config),
                    axios.get(`${API_URL}/api/symptoms/analytics`, config)
                ]);

                setHistory(historyRes.data);
                setAnalytics(analyticsRes.data);

                const wellnessRes = await axios.get(`${API_URL}/api/wellness/today`, config);
                if (wellnessRes.data) {
                    setWellnessLog(wellnessRes.data);
                    setMood(wellnessRes.data.mood);
                    setEnergy(wellnessRes.data.energyLevel);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const handleWellnessSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(`${API_URL}/api/wellness`, {
                mood,
                energyLevel: energy
            }, config);
            setWellnessLog(res.data);
        } catch (error) {
            console.error('Error saving wellness log', error);
        }
        setIsSubmitting(false);
    };

    const severityColors = {
        Mild: '#10B981',
        Moderate: '#F59E0B',
        Severe: '#EF4444'
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Global Style for the blob animation */}
            <style>{`
                @keyframes fluidBlob {
                    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>

            <div className="container" style={{ paddingTop: '2rem' }}>
                {/* Redesigned Hero Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '30px',
                    padding: '3rem',
                    marginBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    {/* Organic Background Blob */}
                    <div style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-50px',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(30, 58, 138, 0.05) 0%, transparent 70%)',
                        zIndex: 0,
                        animation: 'fluidBlob 8s ease-in-out infinite'
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, flex: '1 1 400px' }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(30, 58, 138, 0.05)',
                            padding: '0.4rem 1.2rem',
                            borderRadius: '50px',
                            marginBottom: '1.5rem',
                            fontSize: '0.8125rem',
                            fontWeight: '700',
                            color: '#1e3a8a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            ✨ Personalized Care
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                            Welcome back, {user?.name}!
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: '1.6' }}>
                            Your health journey is looking great. Have you checked your symptoms today?
                        </p>
                        <Link
                            to="/check-symptoms"
                            style={{
                                background: '#1e3a8a',
                                color: 'white',
                                padding: '1rem 2rem',
                                borderRadius: '50px',
                                fontWeight: '700',
                                fontSize: '1rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 10px 25px rgba(30, 58, 138, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(30, 58, 138, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(30, 58, 138, 0.2)';
                            }}
                        >
                            New Symptom Check <FaArrowRight style={{ fontSize: '0.875rem' }} />
                        </Link>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, flex: '0 1 300px', textAlign: 'center' }}>
                        <div style={{
                            width: '240px',
                            height: '240px',
                            background: '#f1f5f9',
                            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            animation: 'fluidBlob 10s ease-in-out infinite reverse',
                            position: 'relative'
                        }}>
                            <img
                                src="/images/hero-landing.png"
                                alt="Health overview"
                                style={{
                                    width: '180px',
                                    height: 'auto',
                                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1))',
                                    animation: 'float 5s ease-in-out infinite'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Daily Wellness Check-in */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    marginBottom: '3rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ position: 'relative', zIndex: 1, flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            How are you feeling today?
                        </h2>
                        <p style={{ opacity: 0.9, fontSize: '1rem', marginBottom: '2rem', maxWidth: '400px' }}>
                            Tracking your daily wellness helps us provide better health insights and personalized care.
                        </p>

                        {!wellnessLog ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
                                {/* Mood Selector */}
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.8 }}>Current Mood</div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {[
                                            { v: 1, e: '😢', l: 'Sad' },
                                            { v: 2, e: '😕', l: 'Meh' },
                                            { v: 3, e: '😐', l: 'Okay' },
                                            { v: 4, e: '🙂', l: 'Good' },
                                            { v: 5, e: '🤩', l: 'Great' }
                                        ].map(m => (
                                            <button
                                                key={m.v}
                                                onClick={() => setMood(m.v)}
                                                title={m.l}
                                                style={{
                                                    fontSize: '1.75rem',
                                                    background: mood === m.v ? 'rgba(255,255,255,0.2)' : 'transparent',
                                                    border: mood === m.v ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
                                                    borderRadius: '16px',
                                                    padding: '0.6rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    transform: mood === m.v ? 'scale(1.1) translateY(-5px)' : 'scale(1)'
                                                }}
                                            >
                                                {m.e}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Energy Selector */}
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.8 }}>Energy Level</div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {[
                                            { v: 1, l: 'Low' },
                                            { v: 3, l: 'Normal' },
                                            { v: 5, l: 'High' }
                                        ].map(e => (
                                            <button
                                                key={e.v}
                                                onClick={() => setEnergy(e.v)}
                                                style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: '700',
                                                    background: energy === e.v ? 'white' : 'rgba(255,255,255,0.1)',
                                                    color: energy === e.v ? '#1e3a8a' : 'white',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '12px',
                                                    padding: '0.6rem 1.25rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: energy === e.v ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'
                                                }}
                                            >
                                                {e.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleWellnessSubmit}
                                    disabled={isSubmitting}
                                    style={{
                                        alignSelf: 'flex-end',
                                        background: 'white',
                                        color: '#1e3a8a',
                                        border: 'none',
                                        padding: '1rem 2rem',
                                        borderRadius: '14px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                                    }}
                                >
                                    {isSubmitting ? 'Saving...' : 'Log Daily Progress'}
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.12)', padding: '1.5rem 2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                                <div style={{
                                    fontSize: '3.5rem',
                                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                                    animation: 'float 4s ease-in-out infinite'
                                }}>
                                    {wellnessLog.mood === 1 && '😢'}
                                    {wellnessLog.mood === 2 && '😕'}
                                    {wellnessLog.mood === 3 && '😐'}
                                    {wellnessLog.mood === 4 && '🙂'}
                                    {wellnessLog.mood === 5 && '🤩'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Daily Wellness Logged!</div>
                                    <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: '1.4' }}>
                                        Energy: {wellnessLog.energyLevel === 1 ? 'Low' : wellnessLog.energyLevel === 3 ? 'Normal' : 'High'} •
                                        You've completed your check-in for today. Consistency is key!
                                    </div>
                                </div>
                                <button
                                    onClick={() => setWellnessLog(null)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Edit Log
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Decorative Icon */}
                    <div style={{ fontSize: '8rem', opacity: 0.1, position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%) rotate(15deg)', zIndex: 0 }}>
                        <FaHeartbeat />
                    </div>
                </div>

                {/* Stats Grid - Modern White Cards */}
                {analytics && analytics.totalChecks > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                        {[
                            { label: 'Total Checks', value: analytics.totalChecks, icon: <FaHeartbeat />, color: '#1e3a8a', bg: 'rgba(30, 58, 138, 0.08)' },
                            { label: 'Mild Cases', value: analytics.severityDistribution?.Mild || 0, icon: <FaChartLine />, color: '#0f766e', bg: 'rgba(15, 118, 110, 0.08)' },
                            { label: 'Symptoms Tracked', value: Object.keys(analytics.symptomFrequency || {}).length, icon: <FaClipboardList />, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.08)' }
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                                border: '1px solid rgba(0, 0, 0, 0.04)',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.06)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
                                }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    background: stat.bg,
                                    color: stat.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions Grid */}
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', color: '#0f172a', letterSpacing: '-0.01em' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    {[
                        { to: '/check-symptoms', icon: <FaStethoscope />, title: 'Symptom Checker', desc: 'Secure health assessment', color: '#1e3a8a', bg: 'rgba(30, 58, 138, 0.05)' },
                        { to: '/find-doctors', icon: <FaSearch />, title: 'Find Specialists', desc: 'Locate local healthcare', color: '#0f766e', bg: 'rgba(15, 118, 110, 0.05)' },
                        { to: '/appointments', icon: <FaCalendarAlt />, title: 'Appointments', desc: 'Schedule and manage', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.05)' },
                        { to: '/medications', icon: <FaPills />, title: 'Medications', desc: 'Track your schedule', color: '#d97706', bg: 'rgba(217, 119, 6, 0.05)' },
                        { to: '/history', icon: <FaClipboardList />, title: 'Medical History', desc: 'Access past reports', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.05)' },
                        { to: '/analytics', icon: <FaChartBar />, title: 'Health Trends', desc: 'Visualize your progress', color: '#0891b2', bg: 'rgba(8, 145, 178, 0.05)' },
                        { to: '/profile', icon: <FaUser />, title: 'My Profile', desc: 'Personalized settings', color: '#be185d', bg: 'rgba(190, 24, 93, 0.05)' },
                        { to: '/metrics', icon: <FaChartLine />, title: 'Health Metrics', desc: 'Vitals and tracking', color: '#4d7c0f', bg: 'rgba(77, 124, 15, 0.05)' }
                    ].map((action, i) => (
                        <Link
                            key={i}
                            to={action.to}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '1.75rem',
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                border: '1px solid rgba(0, 0, 0, 0.04)',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = action.color + '20';
                                e.currentTarget.querySelector('.action-icon').style.background = action.color;
                                e.currentTarget.querySelector('.action-icon').style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.02)';
                                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.04)';
                                e.currentTarget.querySelector('.action-icon').style.background = action.bg;
                                e.currentTarget.querySelector('.action-icon').style.color = action.color;
                            }}
                        >
                            <div className="action-icon" style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '14px',
                                background: action.bg,
                                color: action.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                transition: 'all 0.3s ease'
                            }}>
                                {action.icon}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: '700', color: '#0f172a' }}>{action.title}</h4>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity List */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Recent Health History</h3>
                    {history.length > 0 && (
                        <Link to="/history" style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>
                            View All →
                        </Link>
                    )}
                </div>

                {history.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '30px',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        border: '1px dashed #cbd5e1',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📋</div>
                        <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2rem' }}>You haven't checked any symptoms yet.</p>
                        <Link
                            to="/check-symptoms"
                            style={{
                                background: '#1e3a8a',
                                color: 'white',
                                padding: '0.875rem 2rem',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                        >
                            Start Your First Checkup
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {history.slice(0, 3).map((record) => (
                            <div key={record._id} style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '2rem',
                                border: '1px solid rgba(0, 0, 0, 0.04)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.transform = 'scale(1.005)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.04)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: severityColors[record.severity] + '10',
                                        color: severityColors[record.severity],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem'
                                    }}>
                                        <FaHistory />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.0625rem' }}>
                                            {record.analysisResult?.conditions?.[0]?.name || 'Health Check'}
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                                            {new Date(record.createdAt).toLocaleDateString()} • {record.symptoms.slice(0, 2).join(', ')}{record.symptoms.length > 2 ? '...' : ''}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '50px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    background: severityColors[record.severity] + '15',
                                    color: severityColors[record.severity],
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {record.severity}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
