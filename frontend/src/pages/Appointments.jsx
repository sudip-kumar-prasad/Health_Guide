
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserMd, FaMapMarkerAlt, FaPhone, FaTrashAlt, FaPlus, FaChevronRight, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Appointments Component
 * Purpose: This page displays a list of all appointments booked by the logged-in user.
 * It allows filtering by status (scheduled, completed, etc.) and cancelling upcoming ones.
 */

const Appointments = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get logged-in user details

    // -- STATE MANAGEMENT --
    const [appointmentList, setAppointmentList] = useState([]); // All appointments from database
    const [isDataLoading, setIsDataLoading] = useState(true);    // Loading spinner state
    const [statusFilter, setStatusFilter] = useState('all');    // Current filter (e.g. 'scheduled')

    // -- DATA FETCHING: Get appointments from the server --
    const loadUserAppointments = async () => {
        setIsDataLoading(true);
        try {
            // Get the security token for the API call
            const authToken = localStorage.getItem('token');
            const axiosConfig = {
                headers: { Authorization: `Bearer ${authToken}` }
            };

            // Call the backend API
            const response = await axios.get('http://localhost:5001/api/appointments', axiosConfig);
            setAppointmentList(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load your appointments. Please try again.');
        } finally {
            setIsDataLoading(false);
        }
    };

    // Load data only once when the page opens
    useEffect(() => {
        loadUserAppointments();
    }, []);

    // -- EVENT HANDLERS --

    // Function to cancel a "scheduled" appointment
    const cancelThisAppointment = async (appointmentId) => {
        const userConfirmed = window.confirm('Are you sure you want to cancel this appointment?');
        if (!userConfirmed) return;

        try {
            const authToken = localStorage.getItem('token');
            const axiosConfig = {
                headers: { Authorization: `Bearer ${authToken}` }
            };

            // DELETE request to remove or update status in database
            await axios.delete(`http://localhost:5001/api/appointments/${appointmentId}`, axiosConfig);

            toast.success('Appointment cancelled successfully');
            loadUserAppointments(); // Refresh the list from the server
        } catch (error) {
            console.error('Cancellation Error:', error);
            toast.error('Could not cancel. Please try again later.');
        }
    };

    // -- LOGIC: Filtering & Formatting --

    // Decide which appointments to show based on the selected filter
    const appointmentsToShow = appointmentList.filter(item => {
        if (statusFilter === 'all') return true;
        return item.status === statusFilter;
    });

    // Helper: Map status to a specific color
    const getStatusThemeColor = (status) => {
        const colors = {
            scheduled: '#0ea5e9', // Blue
            completed: '#10b981', // Green
            cancelled: '#ef4444', // Red
            missed: '#f59e0b'    // Amber
        };
        return colors[status] || '#64748b'; // Default Gray
    };

    // Helper: Format date for display (e.g. Wednesday, January 1, 2025)
    const formatPrettyDate = (rawDate) => {
        return new Date(rawDate).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper: Format time (e.g. 10:30 AM)
    const formatPrettyTime = (rawDate) => {
        return new Date(rawDate).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // -- VIEW RENDERING --
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: '#1e3a8a', fontWeight: '800' }}>My Appointments</h1>
                    <p style={{ color: '#64748b' }}>Manage your healthcare visits and history</p>
                </div>
                <button onClick={() => navigate('/find-doctors')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1e3a8a', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                    <FaPlus /> Book New Appointment
                </button>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'white', padding: '1rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginRight: '0.5rem' }}>
                    <FaFilter /> <strong>Show:</strong>
                </div>
                {['all', 'scheduled', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: '10px', border: 'none', background: statusFilter === status ? '#1e3a8a' : '#f1f5f9', color: statusFilter === status ? 'white' : '#64748b', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Main List Rendering */}
            {isDataLoading ? (
                /* 1. Loading State */
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <p>Loading your appointments...</p>
                </div>

            ) : appointmentsToShow.length > 0 ? (
                /* 2. Success: Showing Appointments */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {appointmentsToShow.map((item) => (
                        <div key={item._id} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'center', borderLeft: `6px solid ${getStatusThemeColor(item.status)}` }}>
                            {/* Doctor Icon */}
                            <div style={{ width: '60px', height: '60px', background: '#f0f9ff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e3a8a' }}>
                                <FaUserMd size={30} />
                            </div>

                            {/* Details Area */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, color: '#1e3a8a' }}>{item.doctorName}</h3>
                                    <span style={{ padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', background: `${getStatusThemeColor(item.status)}20`, color: getStatusThemeColor(item.status) }}>
                                        {item.status}
                                    </span>
                                </div>
                                <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontWeight: 'bold' }}>{item.doctorSpecialty}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                                    <span><FaCalendarAlt /> {formatPrettyDate(item.appointmentDate)}</span>
                                    <span><FaClock /> {formatPrettyTime(item.appointmentDate)}</span>
                                    <span style={{ gridColumn: 'span 2' }}><FaMapMarkerAlt /> {item.doctorAddress}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {item.status === 'scheduled' && (
                                    <button onClick={() => cancelThisAppointment(item._id)} style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #ef4444', background: 'white', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaTrashAlt /> Cancel
                                    </button>
                                )}
                                <button style={{ padding: '0.6rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            ) : (
                /* 3. Empty State: No appointments found */
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <FaCalendarAlt size={40} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ color: '#1e3a8a' }}>No appointments yet</h2>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>You haven't booked any visits. Start by finding a doctor near you.</p>
                    <button onClick={() => navigate('/find-doctors')} style={{ background: '#1e3a8a', color: 'white', padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                        Browse Doctors
                    </button>
                </div>
            )}
        </div>
    );
};

export default Appointments;
