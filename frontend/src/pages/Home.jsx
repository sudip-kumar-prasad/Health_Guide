import { Link } from 'react-router-dom';
import { FaCheckCircle, FaStethoscope, FaMapMarkerAlt, FaChartLine, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    return (
        <div style={{ overflow: 'hidden' }}>
            {/* Hero Section - Clean Light Professional Layout */}
            <section style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                padding: '0',
                position: 'relative',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                {/* Subtle background decoration - Professional & Clean */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(30, 58, 138, 0.03) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                <div className="container" style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '4rem',
                    alignItems: 'center',
                    padding: '2rem 1rem',
                    minHeight: '80vh'
                }}>
                    <div>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(30, 58, 138, 0.05)',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '50px',
                            marginBottom: '2rem',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            color: '#1e3a8a',
                            border: '1px solid rgba(30, 58, 138, 0.1)',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            ✨ Smart Health Guidance
                        </div>
                        <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: '900',
                            marginBottom: '1.5rem',
                            lineHeight: '1.1',
                            color: '#0f172a',
                            animation: 'fadeInUp 0.8s ease-out',
                            letterSpacing: '-0.03em'
                        }}>
                            Your Personal<br />
                            <span style={{
                                color: '#1e3a8a',
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                Health Companion
                                <svg width="100%" height="12" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: '5px', left: 0, zIndex: -1, opacity: 0.2 }}>
                                    <path d="M2 10C50 2 150 2 198 10" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            marginBottom: '3rem',
                            color: '#475569',
                            lineHeight: '1.8',
                            animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                            maxWidth: '540px'
                        }}>
                            Experience a new standard of healthcare guidance. Instant symptom analysis, specialist recommendations, and personalized health tracking—all in one secure place.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap',
                            animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
                        }}>
                            <Link
                                to="/check-symptoms"
                                style={{
                                    background: '#1e3a8a',
                                    color: 'white',
                                    padding: '1.125rem 2.5rem',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    fontSize: '1.125rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 10px 30px rgba(30, 58, 138, 0.25)',
                                    transition: 'all 0.3s ease',
                                    border: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 15px 40px rgba(30, 58, 138, 0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 10px 30px rgba(30, 58, 138, 0.25)';
                                }}
                            >
                                Check Symptoms
                                <FaArrowRight style={{ fontSize: '1rem' }} />
                            </Link>
                            <Link
                                to="/signup"
                                style={{
                                    background: 'white',
                                    color: '#1e3a8a',
                                    padding: '1.125rem 2.5rem',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    fontSize: '1.125rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    border: '2px solid rgba(30, 58, 138, 0.1)',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = '#1e3a8a';
                                    e.target.style.background = 'rgba(30, 58, 138, 0.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = 'rgba(30, 58, 138, 0.1)';
                                    e.target.style.background = 'white';
                                }}
                            >
                                Sign Up Free
                            </Link>
                        </div>

                        {/* Updated Trust indicators - Dark text */}
                        <div style={{
                            marginTop: '3.5rem',
                            display: 'flex',
                            gap: '3rem',
                            borderTop: '1px solid #e2e8f0',
                            paddingTop: '2rem'
                        }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>10K+</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Active Users</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>50K+</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Health Checks</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>24/7</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Available</div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        position: 'relative',
                        animation: 'fadeInRight 1s ease-out 0.3s backwards',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2rem'
                    }}>
                        {/* Animated Fluid Background Blob */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(15, 118, 110, 0.08) 0%, rgba(30, 58, 138, 0.05) 100%)',
                            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                            zIndex: 0,
                            animation: 'fluidBlob 8s ease-in-out infinite'
                        }} />

                        {/* Main Image Container */}
                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            borderRadius: '32px',
                            boxShadow: '0 40px 80px -20px rgba(30, 58, 138, 0.25)',
                            background: 'white',
                            padding: '1rem',
                            transform: 'rotate(-2deg)',
                            transition: 'all 0.4s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 50px 100px -20px rgba(30, 58, 138, 0.35)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'rotate(-2deg) scale(1)';
                                e.currentTarget.style.boxShadow = '0 40px 80px -20px rgba(30, 58, 138, 0.25)';
                            }}
                        >
                            <div style={{
                                borderRadius: '24px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="/images/hero-landing.png"
                                    alt="Health technology"
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                            </div>

                            {/* Floating "Active Monitoring" Card */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '-30px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                padding: '1rem 1.5rem',
                                borderRadius: '20px',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                animation: 'float 6s ease-in-out infinite',
                                zIndex: 3,
                                border: '1px solid white'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: '#ecfdf5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#059669',
                                    fontSize: '1.5rem'
                                }}>
                                    🛡️
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Status</div>
                                    <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '800' }}>Active Monitoring</div>
                                </div>
                            </div>

                            {/* Floating "AI Analysis" Card */}
                            <div style={{
                                position: 'absolute',
                                top: '40px',
                                left: '-40px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                padding: '1rem',
                                borderRadius: '16px',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                animation: 'float 7s ease-in-out infinite reverse',
                                zIndex: 3,
                                border: '1px solid white'
                            }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#2563eb',
                                    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'
                                }} />
                                <div style={{ fontSize: '0.875rem', color: '#1e3a8a', fontWeight: '700' }}>
                                    AI Analysis Ready
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Animation Styles */}
            <style>{`
                @keyframes fluidBlob {
                    0% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    }
                    50% {
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                    }
                    100% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    }
                }
            `}</style>

            {/* Features Section - Alternating Layout */}
            <section style={{ padding: '8rem 1rem', background: 'white', position: 'relative' }}>
                {/* Background pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '300px',
                    background: 'linear-gradient(180deg, #f8f9ff 0%, white 100%)',
                    zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '700px', margin: '0 auto 5rem' }}>
                        <div style={{
                            display: 'inline-block',
                            color: '#1e3a8a',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem'
                        }}>
                            Features
                        </div>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: '800',
                            marginBottom: '1.5rem',
                            color: '#1a1a2e',
                            lineHeight: '1.2'
                        }}>
                            Everything You Need for<br />Better Health
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#666',
                            lineHeight: '1.7'
                        }}>
                            Powerful tools designed to help you understand and manage your health with confidence
                        </p>
                    </div>

                    {/* Feature 1 - Left aligned */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        gap: '5rem',
                        alignItems: 'center',
                        marginBottom: '8rem',
                        position: 'relative'
                    }}>
                        {/* Decorative floating dots */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '40px',
                            width: '80px',
                            height: '80px',
                            background: 'radial-gradient(circle, rgba(30, 58, 138, 0.05) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'float 6s ease-in-out infinite',
                            zIndex: 0
                        }} />

                        {/* Feature 1 Image - Tilted Organic Box */}
                        <div style={{
                            position: 'relative',
                            padding: '2rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Navy/Purple Blob */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120%',
                                height: '120%',
                                background: 'radial-gradient(circle, rgba(30, 58, 138, 0.08) 0%, rgba(102, 126, 234, 0.05) 100%)',
                                borderRadius: '40% 60% 70% 30% / 50% 30% 70% 50%',
                                animation: 'fluidBlob 7s ease-in-out infinite',
                                zIndex: 0
                            }} />

                            <div style={{
                                background: 'white',
                                borderRadius: '32px',
                                padding: '1rem',
                                position: 'relative',
                                boxShadow: '0 30px 60px -15px rgba(30, 58, 138, 0.2)',
                                transform: 'rotate(3deg)',
                                transition: 'all 0.4s ease',
                                border: '1px solid rgba(255,255,255,0.8)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 40px 80px -12px rgba(30, 58, 138, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'rotate(3deg) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(30, 58, 138, 0.2)';
                                }}
                            >
                                <div style={{ borderRadius: '24px', overflow: 'hidden' }}>
                                    <img
                                        src="/images/feature-symptoms.png"
                                        alt="Symptom Checker"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Floating "Instant Result" Badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '10px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '50px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                animation: 'float 5s ease-in-out infinite',
                                zIndex: 2,
                                border: '1px solid white'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: '#1e3a8a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}>⚡</div>
                                <div style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '0.875rem' }}>Instant Results</div>
                            </div>
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '18px',
                                background: '#1e3a8a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '2rem',
                                boxShadow: '0 15px 40px rgba(30, 58, 138, 0.2)',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'rotate(10deg) scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
                                }}
                            >
                                <FaCheckCircle style={{ fontSize: '2rem', color: 'white' }} />
                                {/* Pulse effect */}
                                <div style={{
                                    position: 'absolute',
                                    inset: '-5px',
                                    borderRadius: '20px',
                                    background: '#1e3a8a',
                                    opacity: 0.2,
                                    animation: 'pulse 2s ease-in-out infinite'
                                }} />
                            </div>
                            <h3 style={{
                                fontSize: '2.25rem',
                                fontWeight: '800',
                                marginBottom: '1.25rem',
                                color: '#1a1a2e',
                                letterSpacing: '-0.01em'
                            }}>
                                Smart Symptom Checker
                            </h3>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#666',
                                lineHeight: '1.8',
                                marginBottom: '2.5rem'
                            }}>
                                Analyze your symptoms and get instant insights about possible health conditions. Our intelligent system provides personalized recommendations based on your input.
                            </p>
                            <Link
                                to="/check-symptoms"
                                style={{
                                    color: '#1e3a8a',
                                    fontWeight: '700',
                                    fontSize: '1.0625rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.875rem 1.75rem',
                                    background: 'rgba(30, 58, 138, 0.05)',
                                    borderRadius: '50px',
                                    transition: 'all 0.3s ease',
                                    border: '2px solid rgba(30, 58, 138, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.gap = '1rem';
                                    e.target.style.background = 'rgba(30, 58, 138, 0.1)';
                                    e.target.style.borderColor = '#1e3a8a';
                                    e.target.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.gap = '0.5rem';
                                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                                    e.target.style.transform = 'translateX(0)';
                                }}
                            >
                                Try it now <FaArrowRight />
                            </Link>
                        </div>
                    </div>

                    {/* Feature 2 - Right aligned */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.2fr',
                        gap: '5rem',
                        alignItems: 'center',
                        marginBottom: '8rem',
                        position: 'relative'
                    }}>
                        {/* Decorative floating dots */}
                        <div style={{
                            position: 'absolute',
                            bottom: '30px',
                            left: '30px',
                            width: '100px',
                            height: '100px',
                            background: 'radial-gradient(circle, rgba(15, 118, 110, 0.05) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'float 8s ease-in-out infinite',
                            zIndex: 0
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '18px',
                                background: '#0f766e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '2rem',
                                boxShadow: '0 15px 40px rgba(15, 118, 110, 0.2)',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'rotate(10deg) scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(240, 147, 251, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(240, 147, 251, 0.4)';
                                }}
                            >
                                <FaStethoscope style={{ fontSize: '2rem', color: 'white' }} />
                                {/* Pulse effect */}
                                <div style={{
                                    position: 'absolute',
                                    inset: '-5px',
                                    borderRadius: '20px',
                                    background: '#0f766e',
                                    opacity: 0.2,
                                    animation: 'pulse 2s ease-in-out infinite'
                                }} />
                            </div>
                            <h3 style={{
                                fontSize: '2.25rem',
                                fontWeight: '800',
                                marginBottom: '1.25rem',
                                color: '#1a1a2e',
                                letterSpacing: '-0.01em'
                            }}>
                                Find Specialists
                            </h3>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#666',
                                lineHeight: '1.8',
                                marginBottom: '2.5rem'
                            }}>
                                Discover qualified doctors and specialists in your area based on your health needs and location. Get connected with the right care, faster.
                            </p>
                            <Link
                                to="/find-doctors"
                                style={{
                                    color: '#0f766e',
                                    fontWeight: '700',
                                    fontSize: '1.0625rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.875rem 1.75rem',
                                    background: 'rgba(15, 118, 110, 0.05)',
                                    borderRadius: '50px',
                                    transition: 'all 0.3s ease',
                                    border: '2px solid rgba(15, 118, 110, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.gap = '1rem';
                                    e.target.style.background = 'rgba(15, 118, 110, 0.1)';
                                    e.target.style.borderColor = '#0f766e';
                                    e.target.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.gap = '0.5rem';
                                    e.target.style.background = 'rgba(245, 87, 108, 0.1)';
                                    e.target.style.borderColor = 'rgba(245, 87, 108, 0.2)';
                                    e.target.style.transform = 'translateX(0)';
                                }}
                            >
                                Find doctors <FaArrowRight />
                            </Link>
                        </div>
                        {/* Feature 2 Image - Super Rounded Oval */}
                        <div style={{
                            position: 'relative',
                            padding: '2rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Teal/Green Blob */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120%',
                                height: '110%',
                                background: 'radial-gradient(circle, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.05) 100%)',
                                borderRadius: '70% 30% 60% 40% / 40% 60% 40% 60%',
                                animation: 'fluidBlob 8s ease-in-out infinite reverse',
                                zIndex: 0
                            }} />

                            <div style={{
                                background: 'white',
                                borderRadius: '60px',
                                padding: '1rem',
                                position: 'relative',
                                boxShadow: '0 30px 60px -15px rgba(15, 118, 110, 0.2)',
                                transition: 'all 0.4s ease',
                                border: '1px solid rgba(255,255,255,0.8)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02) translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 40px 80px -12px rgba(15, 118, 110, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(15, 118, 110, 0.2)';
                                }}
                            >
                                <div style={{ borderRadius: '48px', overflow: 'hidden' }}>
                                    <img
                                        src="/images/feature-doctors.png"
                                        alt="Find Specialists"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Floating Shield Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                padding: '0.75rem 1rem',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                animation: 'float 6s ease-in-out infinite',
                                zIndex: 2,
                                border: '1px solid white'
                            }}>
                                <div style={{ fontSize: '1.25rem' }}>🛡️</div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Verified</div>
                                    <div style={{ fontSize: '0.875rem', color: '#0f766e', fontWeight: '800' }}>Specialists</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 - Left aligned */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        gap: '5rem',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        {/* Decorative floating dots */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '50px',
                            width: '90px',
                            height: '90px',
                            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'float 7s ease-in-out infinite',
                            zIndex: 0
                        }} />

                        {/* Feature 3 Image - Asymmetric Organic Box */}
                        <div style={{
                            position: 'relative',
                            padding: '2rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Royal Blue Blob */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120%',
                                height: '120%',
                                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                borderRadius: '30% 70% 50% 50% / 30% 30% 70% 70%',
                                animation: 'fluidBlob 9s ease-in-out infinite',
                                zIndex: 0
                            }} />

                            <div style={{
                                background: 'white',
                                borderRadius: '40px 0 40px 0',
                                padding: '1rem',
                                position: 'relative',
                                boxShadow: '0 30px 60px -15px rgba(37, 99, 235, 0.2)',
                                transition: 'all 0.4s ease',
                                border: '1px solid rgba(255,255,255,0.8)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderRadius = '45px 5px 45px 5px';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 40px 80px -12px rgba(37, 99, 235, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderRadius = '40px 0 40px 0';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(37, 99, 235, 0.2)';
                                }}
                            >
                                <div style={{ borderRadius: '32px 0 32px 0', overflow: 'hidden' }}>
                                    <img
                                        src="/images/feature-tracking.png"
                                        alt="Health Tracking"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Floating Stats Card */}
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '10px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                padding: '1rem',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                animation: 'float 7s ease-in-out infinite reverse',
                                zIndex: 2,
                                border: '1px solid white',
                                minWidth: '140px'
                            }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', marginBottom: '0.25rem' }}>TODAY'S VITALS</div>
                                <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>98%</div>
                                    <div style={{ fontSize: '0.875rem', color: '#10b981', marginBottom: '4px' }}>▲ 2%</div>
                                </div>
                                <div style={{ height: '4px', width: '100%', background: '#e2e8f0', borderRadius: '2px', marginTop: '0.5rem' }}>
                                    <div style={{ height: '100%', width: '70%', background: '#2563eb', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '18px',
                                background: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '2rem',
                                boxShadow: '0 15px 40px rgba(37, 99, 235, 0.2)',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'rotate(10deg) scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(79, 172, 254, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(79, 172, 254, 0.4)';
                                }}
                            >
                                <FaChartLine style={{ fontSize: '2rem', color: 'white' }} />
                                {/* Pulse effect */}
                                <div style={{
                                    position: 'absolute',
                                    inset: '-5px',
                                    borderRadius: '20px',
                                    background: '#2563eb',
                                    opacity: 0.2,
                                    animation: 'pulse 2s ease-in-out infinite'
                                }} />
                            </div>
                            <h3 style={{
                                fontSize: '2.25rem',
                                fontWeight: '800',
                                marginBottom: '1.25rem',
                                color: '#1a1a2e',
                                letterSpacing: '-0.01em'
                            }}>
                                Health Tracking
                            </h3>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#666',
                                lineHeight: '1.8',
                                marginBottom: '2.5rem'
                            }}>
                                Track your health journey with detailed analytics, history, and personalized health metrics. Monitor progress and stay informed.
                            </p>
                            <Link
                                to="/analytics"
                                style={{
                                    color: '#2563eb',
                                    fontWeight: '700',
                                    fontSize: '1.0625rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.875rem 1.75rem',
                                    background: 'rgba(37, 99, 235, 0.05)',
                                    borderRadius: '50px',
                                    transition: 'all 0.3s ease',
                                    border: '2px solid rgba(37, 99, 235, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.gap = '1rem';
                                    e.target.style.background = 'rgba(37, 99, 235, 0.1)';
                                    e.target.style.borderColor = '#2563eb';
                                    e.target.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.gap = '0.5rem';
                                    e.target.style.background = 'rgba(79, 172, 254, 0.1)';
                                    e.target.style.borderColor = 'rgba(79, 172, 254, 0.2)';
                                    e.target.style.transform = 'translateX(0)';
                                }}
                            >
                                View analytics <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Modern Timeline */}
            <section style={{
                padding: '8rem 1rem',
                background: 'linear-gradient(180deg, white 0%, #f8f9ff 100%)',
                position: 'relative'
            }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{
                            display: 'inline-block',
                            color: '#1e3a8a',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem'
                        }}>
                            Process
                        </div>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: '800',
                            marginBottom: '1.5rem',
                            color: '#1a1a2e'
                        }}>
                            How It Works
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#666',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Get started with your health journey in three simple steps
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '3rem',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        position: 'relative'
                    }}>
                        {/* Connection line */}
                        <div style={{
                            position: 'absolute',
                            top: '60px',
                            left: '20%',
                            right: '20%',
                            height: '4px',
                            background: '#e2e8f0',
                            borderRadius: '2px',
                            zIndex: 0
                        }} />

                        {[
                            {
                                number: '01',
                                title: 'Describe Your Symptoms',
                                description: 'Enter your symptoms and health concerns in our easy-to-use interface',
                                icon: '📝',
                                color: '#1e3a8a'
                            },
                            {
                                number: '02',
                                title: 'Get Instant Insights',
                                description: 'Receive personalized health information and recommendations',
                                icon: '💡',
                                color: '#0f766e'
                            },
                            {
                                number: '03',
                                title: 'Take Action',
                                description: 'Find specialists, track your health, and get guidance on next steps',
                                icon: '🎯',
                                color: '#2563eb'
                            }
                        ].map((step, idx) => (
                            <div key={idx} style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '2.5rem',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid #f0f0f0'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
                                    }}
                                >
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 2rem',
                                        boxShadow: `0 15px 35px ${step.color}40`,
                                        position: 'relative'
                                    }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{step.icon}</div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: 'white',
                                            opacity: 0.9
                                        }}>
                                            STEP {step.number}
                                        </div>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        marginBottom: '1rem',
                                        color: '#1a1a2e',
                                        textAlign: 'center'
                                    }}>
                                        {step.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '1rem',
                                        color: '#666',
                                        lineHeight: '1.6',
                                        textAlign: 'center'
                                    }}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Medical Disclaimer - Enhanced Modern Design */}
            <section style={{
                padding: '2.5rem 1rem',
                background: 'linear-gradient(180deg, white 0%, #fafafa 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decorative elements */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '-100px',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.04) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float 10s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '-100px',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.04) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float 12s ease-in-out infinite reverse'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Section header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem'
                        }}>
                            Important Notice
                        </div>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            color: '#1a1a2e'
                        }}>
                            Health Information Disclaimer
                        </h2>
                    </div>

                    {/* Enhanced disclaimer card */}
                    <div style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        padding: '0'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.95) 100%)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            border: '2px solid rgba(254, 202, 202, 0.6)',
                            boxShadow: '0 15px 40px rgba(220, 38, 38, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateY(0)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(220, 38, 38, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(220, 38, 38, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                            }}
                        >
                            {/* Multiple decorative circles for depth */}
                            <div style={{
                                position: 'absolute',
                                top: '-60px',
                                right: '-60px',
                                width: '200px',
                                height: '200px',
                                background: 'radial-gradient(circle, rgba(220, 38, 38, 0.06) 0%, transparent 70%)',
                                borderRadius: '50%',
                                animation: 'pulse 4s ease-in-out infinite'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '-40px',
                                left: '-40px',
                                width: '150px',
                                height: '150px',
                                background: 'radial-gradient(circle, rgba(220, 38, 38, 0.04) 0%, transparent 70%)',
                                borderRadius: '50%',
                                animation: 'pulse 5s ease-in-out infinite reverse'
                            }} />

                            {/* Top accent bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #DC2626 0%, #991B1B 50%, #DC2626 100%)',
                                borderRadius: '24px 24px 0 0'
                            }} />

                            {/* Content */}
                            <div style={{
                                padding: '2rem',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1.5rem',
                                    flexWrap: 'wrap'
                                }}>
                                    {/* Warning icon with enhanced styling */}
                                    <div style={{
                                        flexShrink: 0,
                                        width: '65px',
                                        height: '65px',
                                        background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                                        borderRadius: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.8)',
                                        fontSize: '2rem',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        transform: 'rotate(0deg)'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'rotate(-10deg) scale(1.1)';
                                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(220, 38, 38, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.9)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.8)';
                                        }}
                                    >
                                        {/* Pulsing glow */}
                                        <div style={{
                                            position: 'absolute',
                                            inset: '-6px',
                                            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                                            borderRadius: '22px',
                                            opacity: 0.3,
                                            animation: 'pulse 3s ease-in-out infinite',
                                            zIndex: -1
                                        }} />
                                        ⚠️
                                    </div>

                                    {/* Text content */}
                                    <div style={{ flex: 1, minWidth: '250px' }}>
                                        <h3 style={{
                                            color: '#991B1B',
                                            marginBottom: '1rem',
                                            fontSize: '1.35rem',
                                            fontWeight: '800',
                                            letterSpacing: '-0.01em',
                                            lineHeight: '1.2'
                                        }}>
                                            Important Medical Disclaimer
                                        </h3>
                                        <p style={{
                                            color: '#7F1D1D',
                                            lineHeight: '1.7',
                                            fontSize: '1rem',
                                            marginBottom: '1rem'
                                        }}>
                                            This application provides <strong style={{ fontWeight: '700', color: '#991B1B' }}>informational guidance only</strong> and is <strong style={{ fontWeight: '700', color: '#991B1B' }}>NOT a substitute</strong> for professional medical advice, diagnosis, or treatment.
                                        </p>
                                        <p style={{
                                            color: '#7F1D1D',
                                            lineHeight: '1.7',
                                            fontSize: '0.9375rem',
                                            opacity: 0.95
                                        }}>
                                            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                                        </p>

                                        {/* Additional badge */}
                                        <div style={{
                                            marginTop: '1.25rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1.25rem',
                                            background: 'rgba(255, 255, 255, 0.7)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '50px',
                                            border: '2px solid rgba(220, 38, 38, 0.3)',
                                            fontSize: '0.8125rem',
                                            fontWeight: '700',
                                            color: '#991B1B'
                                        }}>
                                            <span style={{ fontSize: '1.125rem' }}>🏥</span>
                                            For Medical Emergencies, Call 911
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA - Modern Style */}
            <section style={{
                padding: '6rem 1rem',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #475569 100%)',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2',
                        maxWidth: '800px',
                        margin: '0 auto 1.5rem'
                    }}>
                        Ready to Take Control of Your Health?
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '3rem',
                        opacity: 0.95,
                        maxWidth: '600px',
                        margin: '0 auto 3rem',
                        lineHeight: '1.7'
                    }}>
                        Join thousands of users who trust VitallQ for their health information needs
                    </p>
                    <Link
                        to="/signup"
                        style={{
                            background: 'white',
                            color: '#1e3a8a',
                            padding: '1.25rem 3.5rem',
                            borderRadius: '50px',
                            fontWeight: '700',
                            fontSize: '1.25rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            border: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-5px) scale(1.05)';
                            e.target.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                        }}
                    >
                        Get Started for Free
                        <FaArrowRight />
                    </Link>
                </div>
            </section>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.05);
                    }
                }

                @media (max-width: 992px) {
                    .container > div[style*="grid"] {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
