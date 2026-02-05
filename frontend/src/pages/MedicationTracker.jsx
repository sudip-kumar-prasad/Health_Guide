import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPills, FaPlus, FaTrash, FaCheckCircle, FaClock, FaExclamationCircle, FaToggleOn, FaToggleOff, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_URL } from '../config';
// Removed unused import: format

const MedicationTracker = () => {
    // State references for our data
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // State for the new medication form
    const [newMed, setNewMed] = useState({
        name: '',
        dosage: '',
        frequency: 'Daily',
        instructions: '',
        stockLeft: '',
        refillReminder: false
    });

    // Load medications when the page opens
    useEffect(() => {
        fetchMedications();
    }, []);

    // Function to get data from server
    const fetchMedications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/medications`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            // Set the data to state
            setMedications(response.data);
        } catch (error) {
            console.log(error);
            toast.error('Error fetching medications');
        }
        setLoading(false);
    };

    // Function to handle the form submit
    const handleAddMedication = async (e) => {
        e.preventDefault(); // Stop page reload

        try {
            const token = localStorage.getItem('token');

            // Prepare data to send
            let stockValue = 0;
            if (newMed.stockLeft) {
                stockValue = parseInt(newMed.stockLeft);
            }

            const dataToSend = {
                name: newMed.name,
                dosage: newMed.dosage,
                frequency: newMed.frequency,
                instructions: newMed.instructions,
                stockLeft: stockValue,
                refillReminder: newMed.refillReminder
            };

            // Send to backend
            await axios.post(`${API_URL}/api/medications`, dataToSend, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            toast.success('Medication added successfully');

            // Close form and reset
            setShowAddForm(false);
            setNewMed({
                name: '',
                dosage: '',
                frequency: 'Daily',
                instructions: '',
                stockLeft: '',
                refillReminder: false
            });

            // Refresh list
            fetchMedications();
        } catch (error) {
            console.log(error);
            toast.error('Error adding medication');
        }
    };

    // Function to toggle active status
    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            // Send the opposite of current status
            const newStatus = !currentStatus;

            await axios.put(`${API_URL}/api/medications/` + id, {
                isActive: newStatus
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            // Refresh the list to show changes
            fetchMedications();
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    // Function to delete medication
    const deleteMedication = async (id) => {
        // Ask for permission first
        const confirmDelete = window.confirm('Are you sure you want to delete this medication?');
        if (confirmDelete === false) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/medications/` + id, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            toast.success('Medication deleted');
            fetchMedications();
        } catch (error) {
            toast.error('Error deleting medication');
        }
    };

    // --- Helpers for Filtering ---

    // Filter for Morning (Daily, Twice, Three times)
    let morningMeds = [];
    for (let i = 0; i < medications.length; i++) {
        const m = medications[i];
        if (m.isActive) {
            const freq = m.frequency.toLowerCase();
            if (freq.includes('daily') || freq.includes('twice') || freq.includes('three')) {
                morningMeds.push(m);
            }
        }
    }

    // Filter for Evening (Twice, Three times, Four times)
    let eveningMeds = [];
    for (let i = 0; i < medications.length; i++) {
        const m = medications[i];
        if (m.isActive) {
            const freq = m.frequency.toLowerCase();
            if (freq.includes('twice') || freq.includes('three') || freq.includes('four')) {
                eveningMeds.push(m);
            }
        }
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                marginBottom: '3rem',
                flexWrap: 'wrap',
                gap: '1rem',
                background: 'linear-gradient(to right, rgba(14, 165, 233, 0.1), transparent)',
                padding: '2rem',
                borderRadius: '2rem',
                border: '1px solid rgba(14, 165, 233, 0.2)'
            }}>
                <div>
                    <h1 className="page-title gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Medication Tracker</h1>
                    <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>Manage your prescriptions and daily schedule with ease</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn btn-primary"
                    style={{
                        borderRadius: '2rem',
                        padding: '0.75rem 2rem',
                        boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {showAddForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add New Medication</>}
                </button>
            </div>

            {/* Add Form Section */}
            {showAddForm && (
                <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '3rem', borderRadius: '1.5rem' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>Add New Medication</h3>
                    <form onSubmit={handleAddMedication}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ marginLeft: '0.5rem' }}>Medication Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Amoxicillin"
                                    value={newMed.name}
                                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                                    required
                                    style={{ borderRadius: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ marginLeft: '0.5rem' }}>Dosage</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. 500mg"
                                    value={newMed.dosage}
                                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                                    required
                                    style={{ borderRadius: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ marginLeft: '0.5rem' }}>Frequency</label>
                                <select
                                    className="form-input"
                                    value={newMed.frequency}
                                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                                    style={{ borderRadius: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)' }}
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Twice a day">Twice a day</option>
                                    <option value="Three times a day">Three times a day</option>
                                    <option value="Four times a day">Four times a day</option>
                                    <option value="Every 8 hours">Every 8 hours</option>
                                    <option value="Every 12 hours">Every 12 hours</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="As needed">As needed (SOS)</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ marginLeft: '0.5rem' }}>Stock Count (optional)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Total units available"
                                    value={newMed.stockLeft}
                                    onChange={(e) => setNewMed({ ...newMed, stockLeft: e.target.value })}
                                    style={{ borderRadius: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ marginLeft: '0.5rem' }}>Instructions</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Take after breakfast"
                                value={newMed.instructions}
                                onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                                style={{ borderRadius: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
                            <input
                                type="checkbox"
                                id="refill"
                                checked={newMed.refillReminder}
                                onChange={(e) => setNewMed({ ...newMed, refillReminder: e.target.checked })}
                                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                            />
                            <label htmlFor="refill" style={{ fontSize: '1rem' }}>Enable refill reminders</label>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
                            Save Medication
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Daily Schedule Card */}
                {medications.length > 0 && (
                    <div className="card glass-panel" style={{
                        gridColumn: '1 / -1',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        color: 'white',
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '1rem' }}>
                                    <FaClock style={{ fontSize: '1.5rem' }} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Daily Schedule</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                {/* Morning Section */}
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '1rem', backdropFilter: 'blur(5px)' }}>
                                    <strong style={{ fontSize: '0.9rem', opacity: 0.9, display: 'block', marginBottom: '1rem', letterSpacing: '1px' }}>MORNING</strong>

                                    {morningMeds.length > 0 ? (
                                        morningMeds.map(m => (
                                            <div key={m._id} style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}></div>
                                                {m.name} <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>({m.dosage})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ opacity: 0.6, fontStyle: 'italic' }}>No morning medications</div>
                                    )}
                                </div>

                                {/* Evening Section */}
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '1rem', backdropFilter: 'blur(5px)' }}>
                                    <strong style={{ fontSize: '0.9rem', opacity: 0.9, display: 'block', marginBottom: '1rem', letterSpacing: '1px' }}>EVENING</strong>

                                    {eveningMeds.length > 0 ? (
                                        eveningMeds.map(m => (
                                            <div key={m._id} style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}></div>
                                                {m.name} <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>({m.dosage})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ opacity: 0.6, fontStyle: 'italic' }}>No evening medications</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State or Medications List */}
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)', gridColumn: '1 / -1' }}>Loading medications...</p>
                ) : medications.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem', gridColumn: '1 / -1', borderRadius: '2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>💊</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No medications found</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Start tracking your medications to get timely reminders and manage your dosages efficiently.
                        </p>
                        <button onClick={() => setShowAddForm(true)} className="btn btn-primary" style={{ borderRadius: '2rem', padding: '0.75rem 2rem' }}>
                            Add Your First Medication
                        </button>
                    </div>
                ) : (
                    medications.map((med, index) => (
                        <div key={med._id} className="card glass-panel card-hover-effect animate-fade-in" style={{
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            borderLeft: med.isActive ? '5px solid var(--primary)' : '5px solid var(--text-light)',
                            opacity: med.isActive ? 1 : 0.8,
                            animationDelay: index * 0.1 + 's',
                            borderRadius: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '1.25rem',
                                        background: med.isActive ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.05))' : 'rgba(100, 116, 139, 0.1)',
                                        color: med.isActive ? 'var(--primary)' : 'var(--text-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.75rem'
                                    }}>
                                        <FaPills />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {med.name}
                                            {med.isActive === false && <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', background: 'var(--border)', borderRadius: '1rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inactive</span>}
                                        </h3>
                                        <p style={{ margin: '0.25rem 0', fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                            {med.dosage}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteMedication(med._id)}
                                    className="btn-icon"
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1rem', padding: '0.5rem', borderRadius: '0.75rem', transition: 'all 0.2s' }}
                                    title="Delete Medication"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <FaClock style={{ color: 'var(--text-light)' }} /> {med.frequency}
                                </div>
                                {med.instructions && (
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        <FaCheckCircle style={{ marginTop: '3px', flexShrink: 0 }} /> {med.instructions}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    {med.stockLeft > 0 && med.stockLeft < 10 && (
                                        <div style={{ color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                                            <FaExclamationCircle /> Low stock: {med.stockLeft}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => toggleStatus(med._id, med.isActive)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '2rem',
                                        cursor: 'pointer',
                                        color: med.isActive ? 'var(--success)' : 'var(--text-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'color 0.3s'
                                    }}
                                    title={med.isActive ? "Active (Click to pause)" : "Paused (Click to activate)"}
                                >
                                    {med.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicationTracker;
