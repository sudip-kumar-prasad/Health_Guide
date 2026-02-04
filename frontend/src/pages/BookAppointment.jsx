
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserMd, FaMapMarkerAlt, FaPhone, FaStar, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * BookAppointment Component
 * Purpose: This page allows users to book an appointment with a selected doctor.
 * It takes doctor details from the previous page (FindDoctors) and collects 
 * patient details, date, and time.
 */

const BookAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Get the doctor details passed from the FindDoctors page
    const doctorInformation = location.state?.selectedDoctor;

    // -- STATE: Storing form data --
    const [bookingForm, setBookingForm] = useState({
        patientName: user?.name || '',
        patientEmail: user?.email || '',
        patientPhone: '',
        appointmentDate: '',
        appointmentTime: '',
        reasonForVisit: '',
        additionalNotes: ''
    });

    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // -- PROTECTION: Redirect if no doctor is selected --
    useEffect(() => {
        if (!doctorInformation) {
            toast.warning('Please select a doctor first');
            navigate('/find-doctors');
        }
    }, [doctorInformation, navigate]);

    // -- HELPERS: Dropdown data and Date limits --

    // List of time slots for the dropdown
    const availableTimeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
        '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
    ];

    // Restrict date selection to today onwards
    const getMinimumDateValue = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    };

    // Restrict date selection to 3 months into the future
    const getMaximumDateValue = () => {
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        return threeMonthsLater.toISOString().split('T')[0];
    };

    // -- EVENT HANDLERS --

    // Update state when user types in inputs
    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setBookingForm(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Clear error message once user starts typing correctly
        if (formErrors[name]) {
            setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    // Validate if the user filled everything correctly
    const isFormValid = () => {
        const errors = {};

        if (!bookingForm.patientName.trim()) errors.patientName = 'Name is required';
        if (!bookingForm.patientEmail.trim()) errors.patientEmail = 'Email is required';
        if (!bookingForm.patientPhone.trim()) errors.patientPhone = 'Phone number is required';
        else if (bookingForm.patientPhone.length < 10) errors.patientPhone = 'Enter a valid 10-digit number';

        if (!bookingForm.appointmentDate) errors.appointmentDate = 'Please select a date';
        if (!bookingForm.appointmentTime) errors.appointmentTime = 'Please select a time';
        if (!bookingForm.reasonForVisit.trim()) errors.reasonForVisit = 'Reason is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    // Submit the booking to the backend
    const handleBookingSubmit = async (event) => {
        event.preventDefault();

        // STEP 1: Check validation
        if (!isFormValid()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);
        try {
            // STEP 2: Prepare Auth Token
            const authToken = localStorage.getItem('token');
            const axiosConfig = {
                headers: { Authorization: `Bearer ${authToken}` }
            };

            // STEP 3: Combine Date and Time for the database
            const fullAppointmentDate = new Date(`${bookingForm.appointmentDate} ${bookingForm.appointmentTime}`);

            // STEP 4: Prepare the payload (data object)
            const finalBookingData = {
                doctorName: doctorInformation.name,
                doctorSpecialty: doctorInformation.specialty,
                doctorAddress: doctorInformation.address,
                appointmentDate: fullAppointmentDate,
                reason: bookingForm.reasonForVisit,
                notes: bookingForm.additionalNotes
            };

            // STEP 5: Send POST request to backend
            const response = await axios.post('http://localhost:5001/api/appointments', finalBookingData, axiosConfig);

            if (response.status === 201) {
                setIsBookingSuccess(true);
                toast.success('Appointment booked successfully!');

                // Wait 2 seconds so user can see the success message, then redirect
                setTimeout(() => {
                    navigate('/appointments');
                }, 2000);
            }
        } catch (error) {
            console.error('Booking Error:', error);
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Avoid rendering if doctor info is missing (protection)
    if (!doctorInformation) return null;

    // -- VIEW --
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header with Back Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#1e3a8a', fontWeight: '600', cursor: 'pointer', marginBottom: '1rem' }}>
                    <FaArrowLeft /> Back to Search
                </button>
                <h1 style={{ fontSize: '2.5rem', color: '#1e3a8a', fontWeight: '800' }}>Book Your Appointment</h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Complete local registration with {doctorInformation.name}</p>
            </div>

            {/* Success Banner */}
            {isBookingSuccess && (
                <div style={{ background: '#d1fae5', border: '2px solid #10b981', borderRadius: '15px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FaCheckCircle size={30} color="#10b981" />
                    <div>
                        <h3 style={{ margin: 0, color: '#065f46' }}>Done! Appointment Confirmed</h3>
                        <p style={{ margin: 0, color: '#047857' }}>We have saved your slot. Redirecting you now...</p>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>

                {/* 1. MAIN FORM SECTION */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleBookingSubmit}>

                        {/* Phase 1: Patient Basics */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#475569' }}>Patient Info</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>FullName</label>
                                <input type="text" name="patientName" value={bookingForm.patientName} onChange={handleFieldChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: formErrors.patientName ? '1px solid red' : '1px solid #ccc' }} />
                                {formErrors.patientName && <small style={{ color: 'red' }}>{formErrors.patientName}</small>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
                                    <input type="email" name="patientEmail" value={bookingForm.patientEmail} onChange={handleFieldChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Phone</label>
                                    <input type="tel" name="patientPhone" value={bookingForm.patientPhone} onChange={handleFieldChange} placeholder="10 Digits" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: formErrors.patientPhone ? '1px solid red' : '1px solid #ccc' }} />
                                </div>
                            </div>
                        </div>

                        {/* Phase 2: Timing */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#475569' }}>Schedule</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}><FaCalendarAlt /> Date</label>
                                    <input type="date" name="appointmentDate" value={bookingForm.appointmentDate} min={getMinimumDateValue()} max={getMaximumDateValue()} onChange={handleFieldChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}><FaClock /> Time Slot</label>
                                    <select name="appointmentTime" value={bookingForm.appointmentTime} onChange={handleFieldChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', background: 'white' }}>
                                        <option value="">Choose Time</option>
                                        {availableTimeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3: Reason */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#475569' }}>Visit Reason</h3>
                            <input type="text" name="reasonForVisit" value={bookingForm.reasonForVisit} onChange={handleFieldChange} placeholder="e.g. Regular Checkup" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '1rem' }} />
                            <textarea name="additionalNotes" value={bookingForm.additionalNotes} onChange={handleFieldChange} placeholder="Any symptoms or notes for the doctor..." rows="3" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}></textarea>
                        </div>

                        {/* Submit Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                            <button type="button" onClick={() => navigate(-1)} style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #ccc', cursor: 'pointer', background: 'white' }}>Cancel</button>
                            <button type="submit" disabled={isSubmitting || isBookingSuccess} style={{ padding: '1rem', borderRadius: '10px', border: 'none', background: '#1e3a8a', color: 'white', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                {isSubmitting ? 'Processing...' : 'Confirm My Appointment'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 2. SIDEBAR SECTION (Doctor Summary) */}
                <div style={{ height: 'fit-content', position: 'sticky', top: '2rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                <FaUserMd size={40} color="#0369a1" />
                            </div>
                            <h3 style={{ margin: 0, color: '#1e3a8a' }}>{doctorInformation.name}</h3>
                            <p style={{ color: '#64748b', fontWeight: 'bold', margin: '0.5rem 0' }}>{doctorInformation.specialty}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                                <FaStar color="#fbbf24" /> <strong>{doctorInformation.rating}</strong>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.9rem' }}>
                            <p style={{ margin: '0 0 0.5rem 0' }}><FaMapMarkerAlt /> {doctorInformation.address}</p>
                            <p style={{ margin: 0 }}><FaPhone /> {doctorInformation.phone}</p>
                        </div>

                        <div style={{ marginTop: '1.5rem', background: '#fff7ed', padding: '1rem', borderRadius: '10px', border: '1px solid #ffedd5', fontSize: '0.85rem', color: '#9a3412' }}>
                            <strong>Friendly Reminder:</strong> Please try to arrive 10 minutes before your slot for a smooth experience.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BookAppointment;
