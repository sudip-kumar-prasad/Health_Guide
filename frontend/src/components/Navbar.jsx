import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [showMore, setShowMore] = useState(false);

    const navStyle = {
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0',
        position: 'relative',
    };

    const innerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    };

    const logoStyle = {
        fontSize: '1.65rem',
        fontWeight: '700', // Reduced from 900 for a more elegant feel
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        textDecoration: 'none',
        letterSpacing: '-0.02em', // Less tight for better readability
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    };

    const linkStyle = {
        marginLeft: '1.5rem',
        fontWeight: '500',
        color: 'var(--text-main)',
        cursor: 'pointer',
        fontSize: '1rem',
        fontFamily: 'inherit',
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        right: '0',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '0.5rem 0',
        display: showMore ? 'block' : 'none',
        zIndex: 1000,
        minWidth: '200px',
    };

    const logoutButtonStyle = {
        ...linkStyle,
        background: 'rgba(239, 68, 68, 0.08)',
        color: '#EF4444',
        padding: '0.4rem 0.8rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        transition: 'all 0.2s',
    };

    const dropdownItemStyle = {
        display: 'block',
        padding: '0.75rem 1.5rem',
        color: 'var(--text-main)',
        fontWeight: '500',
        transition: 'background 0.2s',
    };

    const toggleDropdown = () => setShowMore(!showMore);
    const closeDropdown = () => setShowMore(false);

    return (
        <nav style={navStyle}>
            <div className="container" style={innerStyle}>
                <Link to="/" style={logoStyle}>
                    <FaShieldAlt style={{
                        color: '#1e3a8a',
                        fontSize: '1.35rem',
                        opacity: 0.85, // Softer visual weight
                        filter: 'drop-shadow(0 2px 4px rgba(30,58,138,0.15))'
                    }} />
                    <span style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Vitall</span>
                    <span style={{
                        color: '#3b82f6',
                        fontWeight: '400', // Differentiates the 'Q' with a lighter weight
                        marginLeft: '-1px'
                    }}>Q</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                            <Link to="/check-symptoms" style={linkStyle}>Check Symptoms</Link>
                            <Link to="/find-doctors" style={linkStyle}>Find Doctors</Link>
                            <Link to="/profile" style={linkStyle}>Profile</Link>

                            <div style={{ position: 'relative', marginLeft: '1.5rem' }}>
                                <button
                                    onClick={toggleDropdown}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        ...linkStyle,
                                        marginLeft: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}
                                >
                                    More ▾
                                </button>

                                {showMore && (
                                    <div style={dropdownStyle} onMouseLeave={closeDropdown}>
                                        <Link to="/appointments" style={dropdownItemStyle} onClick={closeDropdown}>Appointments</Link>
                                        <Link to="/medications" style={dropdownItemStyle} onClick={closeDropdown}>Medications</Link>
                                        <Link to="/history" style={dropdownItemStyle} onClick={closeDropdown}>History</Link>
                                        <Link to="/analytics" style={dropdownItemStyle} onClick={closeDropdown}>Analytics</Link>
                                        <Link to="/metrics" style={dropdownItemStyle} onClick={closeDropdown}>Health Metrics</Link>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={logout}
                                style={logoutButtonStyle}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <FaSignOutAlt size={14} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}>Login</Link>
                            <Link to="/signup" style={{ ...linkStyle, color: 'var(--primary)' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
