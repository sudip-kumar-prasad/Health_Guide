import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
    FaTrash,
    FaCalendar,
    FaThermometerHalf,
    FaNotesMedical,
    FaSearch,
    FaFilter,
    FaStethoscope,
    FaExclamationTriangle,
    FaClock
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const History = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ severity: 'all', searchTerm: '' });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/symptoms/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecords(response.data);
        } catch (error) {
            toast.error('Failed to fetch history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5001/api/symptoms/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Record deleted successfully');
                fetchHistory();
            } catch (error) {
                toast.error('Failed to delete record');
            }
        }
    };

    const filteredRecords = records.filter(record => {
        const matchesSeverity = filter.severity === 'all' || record.severity === filter.severity;
        const matchesSearch = filter.searchTerm === '' ||
            record.symptoms.some(s => s.toLowerCase().includes(filter.searchTerm.toLowerCase()));
        return matchesSeverity && matchesSearch;
    });

    const getSeverityConfig = (severity) => {
        switch (severity) {
            case 'Mild': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' };
            case 'Moderate': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' };
            case 'Severe': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' };
            default: return { color: '#64748B', bg: 'rgba(100, 116, 139, 0.1)', border: 'rgba(100, 116, 139, 0.2)' };
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
            <div style={{
                marginBottom: '3rem',
                textAlign: 'center',
                padding: '2rem',
                background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)',
                borderRadius: '2rem'
            }}>
                <h1 className="page-title gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Health Timeline</h1>
                <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>Track your health journey and symptom history</p>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel" style={{
                padding: '1.5rem',
                marginBottom: '3rem',
                borderRadius: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                alignItems: 'center',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
            }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                        type="text"
                        placeholder="Search symptoms..."
                        value={filter.searchTerm}
                        onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)',
                            background: 'var(--background)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                    <FaFilter style={{ color: 'var(--primary)' }} />
                    <select
                        value={filter.severity}
                        onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                        style={{
                            padding: '1rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)',
                            background: 'var(--background)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            flex: 1,
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="all">All Severities</option>
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                    </select>
                </div>
            </div>

            {/* Loading / Empty / List State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
                    <div className="animate-pulse" style={{ fontSize: '1.2rem' }}>Loading your history...</div>
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="glass-panel" style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    borderRadius: '2rem',
                    color: 'var(--text-light)'
                }}>
                    <FaNotesMedical style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }} />
                    <h3>No records found</h3>
                    <p>Start checking your symptoms to build your health history.</p>
                </div>
            ) : (
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    {/* Timeline Line */}
                    <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '1rem',
                        bottom: '1rem',
                        width: '4px',
                        background: 'linear-gradient(to bottom, var(--primary), var(--background))',
                        borderRadius: '2px',
                        opacity: 0.3
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {filteredRecords.map((record, index) => {
                            const severityStyle = getSeverityConfig(record.severity);
                            return (
                                <div key={record._id} className="animate-slide-up" style={{
                                    animationDelay: `${index * 0.1}s`,
                                    position: 'relative'
                                }}>
                                    {/* Timeline Dot */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-2.6rem',
                                        top: '2rem',
                                        width: '1.2rem',
                                        height: '1.2rem',
                                        background: severityStyle.color,
                                        borderRadius: '50%',
                                        border: '4px solid var(--background)',
                                        boxShadow: `0 0 0 2px ${severityStyle.color}40`,
                                        zIndex: 10
                                    }} />

                                    <div className="card glass-panel card-hover-effect" style={{
                                        padding: '0',
                                        borderRadius: '1.5rem',
                                        overflow: 'hidden',
                                        border: `1px solid ${severityStyle.border}`
                                    }}>
                                        {/* Header */}
                                        <div style={{
                                            padding: '1.5rem',
                                            background: severityStyle.bg,
                                            borderBottom: `1px solid ${severityStyle.border}`,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    padding: '0.75rem',
                                                    background: 'var(--surface)',
                                                    borderRadius: '1rem',
                                                    color: severityStyle.color,
                                                    boxShadow: 'var(--shadow-sm)'
                                                }}>
                                                    <FaThermometerHalf style={{ fontSize: '1.2rem' }} />
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span style={{
                                                            fontWeight: '700',
                                                            fontSize: '1.1rem',
                                                            color: severityStyle.color
                                                        }}>{record.severity} Severity</span>
                                                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>•</span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                                            <FaClock /> {record.duration}
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        color: 'var(--text-light)',
                                                        fontSize: '0.9rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginTop: '0.2rem'
                                                    }}>
                                                        <FaCalendar />
                                                        {format(new Date(record.createdAt), 'MMMM dd, yyyy • h:mm a')}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(record._id)}
                                                className="btn-icon"
                                                style={{
                                                    color: 'var(--text-light)',
                                                    width: '2.5rem',
                                                    height: '2.5rem',
                                                    background: 'var(--surface)'
                                                }}
                                                title="Delete Record"
                                            >
                                                <FaTrash style={{ color: '#EF4444' }} />
                                            </button>
                                        </div>

                                        {/* Body */}
                                        <div style={{ padding: '2rem' }}>
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <h4 style={{
                                                    fontSize: '0.9rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    color: 'var(--text-light)',
                                                    marginBottom: '0.75rem'
                                                }}>Symptoms Reported</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                    {record.symptoms.map((symptom, idx) => (
                                                        <span key={idx} style={{
                                                            padding: '0.5rem 1rem',
                                                            background: 'var(--background)',
                                                            borderRadius: '2rem',
                                                            color: 'var(--text-main)',
                                                            fontSize: '0.95rem',
                                                            border: '1px solid var(--border)',
                                                            fontWeight: '500'
                                                        }}>
                                                            {symptom}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {record.analysisResult && (
                                                <div style={{
                                                    background: 'linear-gradient(to right, var(--background), transparent)',
                                                    padding: '1.5rem',
                                                    borderRadius: '1.5rem',
                                                    border: '1px solid var(--border)'
                                                }}>
                                                    <h4 style={{
                                                        fontSize: '1rem',
                                                        color: 'var(--primary)',
                                                        marginBottom: '1rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <FaStethoscope /> Analysis Result
                                                    </h4>

                                                    {record.analysisResult.emergencyWarning && (
                                                        <div style={{
                                                            padding: '1rem',
                                                            background: '#FEF2F2',
                                                            border: '1px solid #FECACA',
                                                            borderRadius: '1rem',
                                                            color: '#B91C1C',
                                                            marginBottom: '1rem',
                                                            display: 'flex',
                                                            gap: '0.75rem',
                                                            alignItems: 'start'
                                                        }}>
                                                            <FaExclamationTriangle style={{ marginTop: '0.2rem' }} />
                                                            <div>
                                                                <div style={{ fontWeight: '700' }}>Emergency Warning</div>
                                                                <div style={{ fontSize: '0.9rem' }}>Refer to nearest hospital immediately.</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {record.analysisResult.conditions && record.analysisResult.conditions.length > 0 && (
                                                        <div style={{ marginBottom: '1rem' }}>
                                                            <span style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Potential Causes: </span>
                                                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                                                {record.analysisResult.conditions.map(c => c.name).join(', ')}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {record.analysisResult.recommendedDoctor && (
                                                        <div style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.5rem 1rem',
                                                            background: 'rgba(59, 130, 246, 0.1)',
                                                            color: 'var(--primary)',
                                                            borderRadius: '0.75rem',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            Recommended Specialist: {record.analysisResult.recommendedDoctor}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
