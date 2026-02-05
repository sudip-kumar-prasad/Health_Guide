import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import {
    FaStethoscope, FaClock, FaExclamationTriangle, FaUserMd,
    FaCapsules, FaShieldAlt, FaSearchPlus, FaClipboardCheck,
    FaArrowRight, FaCheckCircle, FaRedoAlt, FaHome, FaHistory
} from 'react-icons/fa';
import { RiMedicineBottleLine, RiMentalHealthLine } from 'react-icons/ri';

const SymptomCheck = () => {
    const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Result
    const [formData, setFormData] = useState({
        symptoms: '',
        duration: '1-2 days',
        severity: 'Mild'
    });
    const [result, setResult] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('Consulting medical logic...');
    const [activePart, setActivePart] = useState(null);

    const handleBodyPartClick = (part, symptom) => {
        setActivePart(part);
        const currentSymptoms = formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : [];
        if (!currentSymptoms.includes(symptom.toLowerCase())) {
            const newSymptoms = [...currentSymptoms, symptom].filter(Boolean).join(', ');
            setFormData({ ...formData, symptoms: newSymptoms });
        }
        // Small feedback reset
        setTimeout(() => setActivePart(null), 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStep(2);

        // Dynamic loading messages
        const messages = [
            'Analyzing symptom patterns...',
            'Consulting medical knowledge base...',
            'Identifying potential conditions...',
            'Preparing specialist recommendations...'
        ];
        let msgIndex = 0;
        const interval = setInterval(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            setLoadingMessage(messages[msgIndex]);
        }, 1500);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const symptomsArray = formData.symptoms.split(',').map(s => s.trim());

            const { data } = await axios.post(`${API_URL}/api/symptoms/analyze`, {
                symptoms: symptomsArray,
                duration: formData.duration,
                severity: formData.severity
            }, config);

            clearInterval(interval);
            setResult(data);
            setStep(3);
        } catch (error) {
            clearInterval(interval);
            console.error(error);
            alert('Analysis failed. Please try again.');
            setStep(1);
        }
    };

    if (step === 2) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '6rem', maxWidth: '600px' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                    <div className="pulse" style={{
                        fontSize: '4rem',
                        color: '#1e3a8a',
                        background: 'rgba(30, 58, 138, 0.05)',
                        padding: '2.5rem',
                        borderRadius: '50%'
                    }}>
                        <FaStethoscope />
                    </div>
                </div>
                <h2 style={{ color: '#1e3a8a', fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Symptom Analysis
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
                    {loadingMessage}
                </p>
                <div style={{
                    marginTop: '2rem',
                    width: '100%',
                    height: '6px',
                    background: '#f1f5f9',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div className="loading-bar" style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)',
                        width: '70%',
                        borderRadius: '3px'
                    }} />
                </div>

                <style>{`
                    .pulse { animation: pulse 2s infinite ease-in-out; }
                    @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
                    .loading-bar { animation: loading 3s infinite ease-in-out; }
                    @keyframes loading { 0% { width: 10%; transform: translateX(-10%); } 50% { width: 80%; } 100% { width: 10%; transform: translateX(1000%); } }
                `}</style>
            </div>
        );
    }

    if (step === 3 && result) {
        const isEmergency = result.analysisResult.emergencyWarning;

        return (
            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
                {/* Result Hero */}
                <div className="card" style={{
                    padding: '2.5rem',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: '32px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '-40px',
                        width: '250px',
                        height: '250px',
                        background: isEmergency ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.08) 100%)' : 'linear-gradient(135deg, rgba(15, 118, 110, 0.05) 0%, rgba(37, 99, 235, 0.08) 100%)',
                        borderRadius: '50% 50% 70% 30% / 30% 40% 60% 70%',
                        zIndex: 1
                    }} />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 1.25rem',
                            background: isEmergency ? 'rgba(220, 38, 38, 0.05)' : 'rgba(15, 118, 110, 0.05)',
                            borderRadius: '2rem',
                            color: isEmergency ? '#991b1b' : '#0f766e',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            marginBottom: '1rem'
                        }}>
                            {isEmergency ? <FaExclamationTriangle /> : <FaClipboardCheck />}
                            {isEmergency ? 'Urgent Analysis' : 'Analysis Complete'}
                        </div>
                        <h2 style={{ color: '#1e3a8a', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Your Health Insights
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '550px' }}>
                            Based on your symptoms, here is a preliminary analysis and guide for next steps.
                        </p>
                    </div>
                </div>

                {isEmergency && (
                    <div style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
                        border: '2px solid rgba(220, 38, 38, 0.1)',
                        padding: '2rem',
                        borderRadius: '24px',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '1.5rem',
                        boxShadow: '0 10px 20px rgba(153, 27, 27, 0.05)'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            flexShrink: 0,
                            boxShadow: '0 6px 15px rgba(220, 38, 38, 0.3)'
                        }}>
                            <FaExclamationTriangle size={24} />
                        </div>
                        <div>
                            <h3 style={{ color: '#991b1b', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Emergency Warning</h3>
                            <p style={{ color: '#7f1d1d', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                                Your symptoms indicate a potentially serious condition. **Please visit an emergency room or call emergency services immediately.**
                            </p>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    {/* Conditions Section */}
                    <div className="card" style={{ padding: '2rem', borderRadius: '24px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: '#1e3a8a' }}>
                            <FaSearchPlus /> <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Possible Conditions</h3>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {result.analysisResult.conditions.map((c, idx) => (
                                <div key={idx} style={{
                                    padding: '1.25rem',
                                    background: '#f8fafc',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: '700', color: '#334155' }}>{c.name}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        color: '#64748b',
                                        padding: '0.35rem 0.75rem',
                                        background: '#ffffff',
                                        borderRadius: '2rem',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                                    }}>{c.probability}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {/* Recommended Specialist */}
                        <div className="card" style={{
                            padding: '1.5rem',
                            borderRadius: '24px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            color: '#0369a1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0369a1',
                                boxShadow: '0 4px 10px rgba(3, 105, 161, 0.1)'
                            }}>
                                <FaUserMd size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>See This Specialist</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{result.analysisResult.recommendedDoctor}</div>
                            </div>
                        </div>

                        {/* Suggested Medicines */}
                        <div className="card" style={{
                            padding: '1.5rem',
                            borderRadius: '24px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                            color: '#15803d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#15803d',
                                boxShadow: '0 4px 10px rgba(21, 128, 61, 0.1)'
                            }}>
                                <FaCapsules size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>OTC Guidance</div>
                                <div style={{ fontSize: '1rem', fontWeight: '700' }}>{result.analysisResult.suggestedMedicine.join(', ')}</div>
                                <small style={{ display: 'block', marginTop: '0.25rem', opacity: 0.8 }}>*Consult a pharmacist first.</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Actions */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    padding: '2rem',
                    background: '#ffffff',
                    borderRadius: '24px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                    <Link
                        to="/find-doctors"
                        state={{ specialty: result.analysisResult.recommendedDoctor }}
                        className="btn-primary"
                        style={{
                            padding: '0.875rem 1.75rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: '#1e3a8a',
                            color: 'white',
                            fontWeight: '700',
                            textDecoration: 'none'
                        }}
                    >
                        <FaSearchPlus /> Find Doctors Near Me
                    </Link>
                    <button
                        onClick={() => { setStep(1); setResult(null); setFormData(prev => ({ ...prev, symptoms: '' })); }}
                        style={{
                            padding: '0.875rem 1.75rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: '#f1f5f9',
                            border: 'none',
                            color: '#475569',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        <FaRedoAlt /> Start New Analysis
                    </button>
                    <Link to="/dashboard" style={{
                        padding: '0.875rem 1.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'transparent',
                        border: '2px solid #e2e8f0',
                        color: '#1e3a8a',
                        fontWeight: '700',
                        textDecoration: 'none'
                    }}>
                        <FaHome /> Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>
            {/* Redesigned Input Hero */}
            <div className="card" style={{
                padding: '2.5rem',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                background: '#ffffff',
                border: 'none',
                borderRadius: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '250px',
                    height: '250px',
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    borderRadius: '50% 50% 70% 30% / 30% 40% 60% 70%',
                    zIndex: 1
                }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1.25rem',
                        background: 'rgba(30, 58, 138, 0.05)',
                        borderRadius: '2rem',
                        color: '#1e3a8a',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        <FaShieldAlt /> Health Security
                    </div>
                    <h1 style={{ color: '#1e3a8a', fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        Symptom Checker
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '450px' }}>
                        Describe how you're feeling for a professional-grade analysis based on medical patterns.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '2rem', alignItems: 'start' }}>
                {/* Visual Body Map */}
                <div className="card" style={{ padding: '2rem', borderRadius: '32px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center', background: 'white' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e3a8a' }}>Visual Selector</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>Click a body part to add symptoms</p>

                    <div style={{ position: 'relative', width: '220px', margin: '0 auto' }}>
                        <svg viewBox="0 0 200 500" style={{ width: '100%', height: 'auto', pointerEvents: 'all' }}>
                            {/* Head */}
                            <circle
                                cx="100" cy="50" r="40"
                                fill={activePart === 'head' ? '#3b82f6' : '#f1f5f9'}
                                stroke={activePart === 'head' ? '#1e3a8a' : '#cbd5e1'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => handleBodyPartClick('head', 'Headache')}
                            />
                            {/* Neck */}
                            <rect x="85" y="90" width="30" height="30" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />

                            {/* Torso/Chest */}
                            <path
                                d="M60 120 L140 120 L150 220 L50 220 Z"
                                fill={activePart === 'chest' ? '#3b82f6' : '#f1f5f9'}
                                stroke={activePart === 'chest' ? '#1e3a8a' : '#cbd5e1'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => handleBodyPartClick('chest', 'Chest pain')}
                            />

                            {/* Abdomen */}
                            <path
                                d="M50 220 L150 220 L140 320 L60 320 Z"
                                fill={activePart === 'abdomen' ? '#3b82f6' : '#f1f5f9'}
                                stroke={activePart === 'abdomen' ? '#1e3a8a' : '#cbd5e1'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => handleBodyPartClick('abdomen', 'Abdominal pain')}
                            />

                            {/* Left Arm */}
                            <path
                                d="M60 120 L30 250 L55 260 L75 160 Z"
                                fill={activePart === 'larm' ? '#3b82f6' : '#f1f5f9'}
                                stroke={activePart === 'larm' ? '#1e3a8a' : '#cbd5e1'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => handleBodyPartClick('larm', 'Arm pain')}
                            />

                            {/* Right Arm */}
                            <path
                                d="M140 120 L170 250 L145 260 L125 160 Z"
                                fill={activePart === 'rarm' ? '#3b82f6' : '#f1f5f9'}
                                stroke={activePart === 'rarm' ? '#1e3a8a' : '#cbd5e1'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => handleBodyPartClick('rarm', 'Arm pain')}
                            />

                            {/* Left Leg */}
                            <path
                                d="M60 320 L40 480 L75 480 L85 320 Z"
                                fill={activePart === 'lleg' ? '#3b82f6' : '#f1f5f9'}
                                stroke={activePart === 'lleg' ? '#1e3a8a' : '#cbd5e1'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => handleBodyPartClick('lleg', 'Leg pain')}
                            />

                            {/* Right Leg */}
                            <path
                                d="M140 320 L160 480 L125 480 L115 320 Z"
                                fill={activePart === 'rleg' ? '#3b82f6' : '#f1f5f9'}
                                stroke={activePart === 'rleg' ? '#1e3a8a' : '#cbd5e1'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => handleBodyPartClick('rleg', 'Leg pain')}
                            />
                        </svg>
                    </div>
                </div>

                <div className="card" style={{ padding: '2.5rem', borderRadius: '32px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', background: 'white' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#1e3a8a', fontWeight: '800' }}>
                                <FaStethoscope /> <span>How are you feeling?</span>
                            </div>
                            <textarea
                                className="form-input"
                                rows="4"
                                placeholder="e.g., headache, fever, sore throat..."
                                value={formData.symptoms}
                                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                required
                                style={{ borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', width: '100%' }}
                            ></textarea>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                                💡 Separate multiple symptoms with commas
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#1e3a8a', fontWeight: '800' }}>
                                    <FaClock /> <span>Duration</span>
                                </div>
                                <select
                                    className="form-input"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    style={{ borderRadius: '12px', height: '50px' }}
                                >
                                    <option>Less than 1 day</option>
                                    <option>1-2 days</option>
                                    <option>3-5 days</option>
                                    <option>One week +</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#1e3a8a', fontWeight: '800' }}>
                                    <FaExclamationTriangle /> <span>Severity</span>
                                </div>
                                <select
                                    className="form-input"
                                    value={formData.severity}
                                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                    style={{ borderRadius: '12px', height: '50px' }}
                                >
                                    <option>Mild</option>
                                    <option>Moderate</option>
                                    <option>Severe</option>
                                </select>
                            </div>
                        </div>

                        <div style={{
                            background: '#fff7ed',
                            padding: '1.25rem',
                            borderRadius: '20px',
                            marginBottom: '2rem',
                            border: '1px solid #fed7aa',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'start'
                        }}>
                            <FaExclamationTriangle style={{ color: '#9a3412', marginTop: '3px' }} />
                            <p style={{ fontSize: '0.9rem', color: '#9a3412', margin: 0, lineHeight: '1.5' }}>
                                **Emergency Note:** If you are experiencing chest pain, difficulty breathing, or severe bleeding, please call emergency services immediately.
                            </p>
                        </div>

                        <button type="submit" className="btn-primary" style={{
                            width: '100%',
                            padding: '1.1rem',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            background: '#1e3a8a',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 6px 20px rgba(30, 58, 138, 0.2)'
                        }}>
                            Start Analysis <FaArrowRight size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SymptomCheck;
