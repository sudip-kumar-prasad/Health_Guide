
import React, { useState } from 'react';
import { FaUserMd, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const FindDoctors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for search functionality
        console.log('Searching for:', searchTerm, 'in', location);
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#1e3a8a',
                    marginBottom: '1rem',
                    fontWeight: '800'
                }}>
                    Find a Specialist
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
                    Connect with qualified healthcare professionals near you
                </p>
            </div>

            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                marginBottom: '4rem'
            }}>
                <form onSubmit={handleSubmit} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr auto',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8'
                        }} />
                        <input
                            type="text"
                            placeholder="Specialty, doctor name, or condition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaMapMarkerAlt style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8'
                        }} />
                        <input
                            type="text"
                            placeholder="City, zip code, or location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button type="submit" style={{
                        background: '#1e3a8a',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                    }}>
                        Search
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '20px' }}>
                <FaUserMd style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }} />
                <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Search to Find Doctors</h3>
                <p style={{ color: '#94a3b8' }}>Enter a specialty and location to see available doctors.</p>
            </div>
        </div>
    );
};

export default FindDoctors;
