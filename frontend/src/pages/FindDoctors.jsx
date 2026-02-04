import React, { useState, useEffect } from 'react';
import { FaUserMd, FaMapMarkerAlt, FaPhone, FaStar, FaCrosshairs, FaDirections } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


// --- HELPER FUNCTIONS ---

// This function creates "Fake" doctor data in case the real API fails or returns no results
// It takes latitude and longitude as input to place fake doctors near the user
const generateSampleDoctors = (userLatitude, userLongitude) => {
    // List of various specialties to make the app look realistic
    const specialtiesData = [
        { name: 'City General Hospital', specialty: 'Hospital', category: 'hospital', offset: [0.01, 0.01] },
        { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', category: 'cardio', offset: [0.015, -0.01] },
        { name: 'Dr. Michael Chen', specialty: 'Dermatologist', category: 'derma', offset: [-0.01, 0.015] },
        { name: 'Dr. Emily Williams', specialty: 'Pediatrician', category: 'pediatric', offset: [0.02, 0.005] },
        { name: 'Dr. James Rodriguez', specialty: 'Orthopedic Surgeon', category: 'ortho', offset: [-0.015, -0.015] },
        { name: 'Dr. Lisa Thompson', specialty: 'Neurologist', category: 'neuro', offset: [0.005, 0.02] },
        { name: 'Dr. Rajesh Kumar', specialty: 'General Physician', category: 'general', offset: [-0.005, -0.01] },
        { name: 'Dr. Priya Sharma', specialty: 'Dentist', category: 'dental', offset: [0.012, -0.018] },
        { name: 'Dr. Amit Patel', specialty: 'Ophthalmologist', category: 'eye', offset: [-0.018, 0.01] },
        { name: 'Dr. Sneha Desai', specialty: 'ENT Specialist', category: 'ent', offset: [0.008, 0.015] },
        { name: 'SmileCare Dental Clinic', specialty: 'Dentist', category: 'dental', offset: [-0.012, 0.008] },
        { name: 'Heart & Vascular Center', specialty: 'Cardiologist', category: 'cardio', offset: [0.018, -0.012] },
    ];

    // Create an array of doctor objects with IDs, names, and random ratings
    return specialtiesData.map((doc, index) => ({
        id: `sample-${index + 1}`,
        name: doc.name,
        specialty: doc.specialty,
        specialtyCategory: doc.category,
        rating: (4.5 + Math.random() * 0.5).toFixed(1), // Random rating between 4.5 and 5.0
        reviews: Math.floor(Math.random() * 200) + 50,
        address: 'Main St, Health District', // Simplified address for sample data
        phone: '+91 98765 43210', // Simplified phone for sample data
        latitude: userLatitude + doc.offset[0], // Slightly shift position from user
        longitude: userLongitude + doc.offset[1],
        type: doc.category === 'hospital' ? 'hospital' : 'clinic'
    }));
};

// List of specialties displayed as filter buttons
const specialtyFilterOptions = [
    { id: 'all', name: 'All Doctors', icon: '👨‍⚕️' },
    { id: 'hospital', name: 'Hospital', icon: '🏥' },
    { id: 'general', name: 'General Physician', icon: '🩺' },
    { id: 'cardio', name: 'Cardiologist', icon: '❤️' },
    { id: 'derma', name: 'Dermatologist', icon: '🧴' },
    { id: 'pediatric', name: 'Pediatrician', icon: '👶' },
    { id: 'ortho', name: 'Orthopedic', icon: '🦴' },
    { id: 'neuro', name: 'Neurologist', icon: '🧠' },
    { id: 'dental', name: 'Dentist', icon: '🦷' },
    { id: 'eye', name: 'Ophthalmologist', icon: '👁️' },
    { id: 'ent', name: 'ENT Specialist', icon: '👂' }
];

// --- MAIN COMPONENT ---

const FindDoctors = () => {
    const navigate = useNavigate();

    // -- STATE VARIABLES (Storing data that changes) --
    const [locationText, setLocationText] = useState('Detecting location...'); // Text shown in search bar
    const [allDoctors, setAllDoctors] = useState([]); // All doctors found in the area (before filtering)
    const [filteredDoctors, setFilteredDoctors] = useState([]); // Doctors shown after applying filters
    const [userCoordinates, setUserCoordinates] = useState(null); // [latitude, longitude] of the user
    const [isLoading, setIsLoading] = useState(true); // Is the app busy fetching data?
    const [searchRadius, setSearchRadius] = useState(5000); // 5000 meters = 5km
    const [selectedSpecialty, setSelectedSpecialty] = useState('all'); // Currently selected filter

    // -- API FUNCTIONS --

    // Function 1: Fetch real healthcare data from OpenStreetMap (Overpass API)
    const fetchNearbyHealthcare = async (latitude, longitude, radius = 5000) => {
        setIsLoading(true);
        try {
            // STEP 1: Prepare the "Overpass" query string
            // It asks the map database for hospitals, clinics, and doctors within X meters
            const overpassQuery = `
                [out:json];
                (
                    node["amenity"="hospital"](around:${radius},${latitude},${longitude});
                    node["amenity"="clinic"](around:${radius},${latitude},${longitude});
                    node["amenity"="doctors"](around:${radius},${latitude},${longitude});
                    way["amenity"="hospital"](around:${radius},${latitude},${longitude});
                    way["amenity"="clinic"](around:${radius},${latitude},${longitude});
                    way["amenity"="doctors"](around:${radius},${latitude},${longitude});
                );
                out center;
            `;

            // STEP 2: Send the request to the API
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: overpassQuery
            });

            const data = await response.json();

            // STEP 3: "Clean" the data into a format our app understands
            const foundPlaces = data.elements.map((element, index) => {
                const elementDetails = element.tags || {};

                // Get name or provide a default
                const name = elementDetails.name || `Healthcare Center ${index + 1}`;

                // Get address by combining multiple fields
                const street = elementDetails['addr:street'] || '';
                const city = elementDetails['addr:city'] || '';
                const fullAddress = street && city ? `${street}, ${city}` : 'Address not available';

                // Determine specialty category (very simplified logic)
                let category = 'general';
                const amenity = elementDetails.amenity || '';
                if (amenity === 'hospital') category = 'hospital';
                else if (elementDetails.healthcare === 'doctor') category = 'general'; // Default for doctors
                else if (elementDetails.healthcare === 'clinic') category = 'general'; // Default for clinics

                // More specific category mapping based on tags or name
                const specialtyLower = (elementDetails.healthcare_speciality || elementDetails.speciality || name).toLowerCase();
                if (specialtyLower.includes('cardio')) category = 'cardio';
                else if (specialtyLower.includes('derma') || specialtyLower.includes('skin')) category = 'derma';
                else if (specialtyLower.includes('pediatric') || specialtyLower.includes('child')) category = 'pediatric';
                else if (specialtyLower.includes('ortho') || specialtyLower.includes('bone')) category = 'ortho';
                else if (specialtyLower.includes('neuro') || specialtyLower.includes('brain')) category = 'neuro';
                else if (specialtyLower.includes('dental') || specialtyLower.includes('dentist')) category = 'dental';
                else if (specialtyLower.includes('eye') || specialtyLower.includes('ophthalm')) category = 'eye';
                else if (specialtyLower.includes('ent') || specialtyLower.includes('ear')) category = 'ent';

                return {
                    id: element.id,
                    name: name,
                    specialty: elementDetails.healthcare_speciality || elementDetails.speciality || amenity === 'hospital' ? 'Hospital' : 'Clinic/Doctor',
                    specialtyCategory: category,
                    rating: (4.5 + Math.random() * 0.5).toFixed(1), // Random rating
                    reviews: Math.floor(Math.random() * 100) + 10,
                    address: fullAddress,
                    phone: elementDetails.phone || '+91 00000 00000',
                    latitude: element.lat || element.center?.lat,
                    longitude: element.lon || element.center?.lon
                };
            }).filter(place => place.latitude && place.longitude); // Remove results with no position

            // STEP 4: Merge results with sample data if needed
            // This ensures the page always has some content to show, even if API returns few results
            const sampleData = generateSampleDoctors(latitude, longitude);
            const combinedResults = [...foundPlaces, ...sampleData];

            setAllDoctors(combinedResults);

            // Apply current filter to new results
            if (selectedSpecialty === 'all') {
                setFilteredDoctors(combinedResults);
            } else {
                setFilteredDoctors(combinedResults.filter(d => d.specialtyCategory === selectedSpecialty));
            }

        } catch (error) {
            console.error('API Error:', error);
            // Fallback to sample data if network fails
            const sampleData = generateSampleDoctors(latitude, longitude);
            setAllDoctors(sampleData);
            setFilteredDoctors(sampleData);
        } finally {
            setIsLoading(false);
        }
    };

    // Function 2: Convert Coordinates to Address (Reverse Geocoding)
    const updateLocationTextFromCoords = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`
            );
            const data = await response.json();
            if (data && data.display_name) {
                // Get a short version of the address (e.g., just the area and city)
                const addr = data.address;
                const locationParts = [];

                if (addr?.neighbourhood) locationParts.push(addr.neighbourhood);
                else if (addr?.suburb) locationParts.push(addr.suburb);
                else if (addr?.village) locationParts.push(addr.village);
                else if (addr?.hamlet) locationParts.push(addr.hamlet);
                else if (addr?.road) locationParts.push(addr.road);

                if (addr?.city) {
                    locationParts.push(addr.city);
                } else if (addr?.town) {
                    locationParts.push(addr.town);
                } else if (addr?.municipality) {
                    locationParts.push(addr.municipality);
                } else if (addr?.county) {
                    locationParts.push(addr.county);
                }

                const locationName = locationParts.length > 0
                    ? locationParts.join(', ')
                    : data.display_name.split(',').slice(0, 2).join(',').trim();

                setLocationText(locationName);
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            setLocationText('Current Location');
        }
    };

    // -- EFFECT HOOKS (Run code at specific times, like when the component loads) --

    // When page first loads, find where the user is
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const latitude = pos.coords.latitude;
                    const longitude = pos.coords.longitude;

                    setUserCoordinates([latitude, longitude]);
                    updateLocationTextFromCoords(latitude, longitude);
                    fetchNearbyHealthcare(latitude, longitude, searchRadius);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Fallback to a default location (e.g., center of Pune, India) if location access is denied
                    const defaultLatitude = 18.5204; // Pune latitude
                    const defaultLongitude = 73.8567; // Pune longitude
                    setUserCoordinates([defaultLatitude, defaultLongitude]);
                    setLocationText('Pune, India');
                    fetchNearbyHealthcare(defaultLatitude, defaultLongitude, searchRadius);
                }
            );
        } else {
            // Geolocation not supported by browser
            console.warn('Geolocation is not supported by this browser.');
            const defaultLatitude = 18.5204;
            const defaultLongitude = 73.8567;
            setUserCoordinates([defaultLatitude, defaultLongitude]);
            setLocationText('Pune, India');
            fetchNearbyHealthcare(defaultLatitude, defaultLongitude, searchRadius);
        }
    }, []); // Empty array means this runs only once when the component mounts

    // -- EVENT HANDLERS (Functions triggered by user interactions) --

    // When user changes the Specialty filter
    const handleFilterChange = (specialtyId) => {
        setSelectedSpecialty(specialtyId);

        if (specialtyId === 'all') {
            setFilteredDoctors(allDoctors); // Show all doctors if 'All' is selected
        } else {
            // Only show doctors matching the selected category
            const filtered = allDoctors.filter(doctor => doctor.specialtyCategory === specialtyId);
            setFilteredDoctors(filtered);
        }
    };

    // When user changes the Search Radius (2km, 5km, etc)
    const handleRadiusChange = (newRadius) => {
        setSearchRadius(newRadius);
        if (userCoordinates) {
            // Re-fetch healthcare facilities with the new radius
            fetchNearbyHealthcare(userCoordinates[0], userCoordinates[1], newRadius);
        }
    };

    // When "Book Appointment" is clicked
    const goToBookingPage = (doctor) => {
        // Send the doctor's info to the next page using React Router State
        navigate('/book-appointment', {
            state: {
                selectedDoctor: {
                    name: doctor.name,
                    specialty: doctor.specialty,
                    address: doctor.address,
                    phone: doctor.phone,
                    rating: doctor.rating
                }
            }
        });
    };

    // When "Directions" button is clicked
    const handleGetDirections = (doctor) => {
        // Open Google Maps with directions to the doctor's location
        const destination = `${doctor.latitude},${doctor.longitude}`;
        let mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

        if (userCoordinates) {
            // If user location is known, use it as the origin for more accurate directions
            const origin = `${userCoordinates[0]},${userCoordinates[1]}`;
            mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        }
        window.open(mapsUrl, '_blank');
    };

    // -- RENDER (What the user sees) --
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

            {/* 1. Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#1e3a8a', fontWeight: '800' }}>Find a Specialist</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Connect with qualified healthcare professionals near you</p>
            </div>

            {/* 2. Search & Location Bar */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                {isLoading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: '#e0f2fe',
                        borderRadius: '10px',
                        color: '#0369a1'
                    }}>
                        🔍 Detecting your location and finding nearby healthcare facilities...
                    </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <FaMapMarkerAlt style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            value={locationText}
                            readOnly // Let users know we detected it automatically, not for manual input
                            style={{ width: '100%', padding: '1rem 3rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', color: '#1e293b' }}
                        />
                    </div>
                    <button
                        onClick={() => window.location.reload()} // Simple refresh to re-detect location
                        style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '1rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            whiteSpace: 'nowrap'
                        }}>
                        <FaCrosshairs /> My Location
                    </button>
                </div>

                {/* 3. Radius Options */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.95rem' }}>Search Radius:</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[2000, 5000, 10000].map((radius) => (
                            <button
                                key={radius}
                                onClick={() => handleRadiusChange(radius)}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '8px',
                                    border: searchRadius === radius ? '2px solid #1e3a8a' : '2px solid #e2e8f0',
                                    background: searchRadius === radius ? '#1e3a8a' : 'white',
                                    color: searchRadius === radius ? 'white' : '#64748b',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                }}>
                                {radius / 1000}km
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Specialty Category Filter Buttons */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e3a8a', fontSize: '1.1rem', fontWeight: '700' }}>Select Specialty</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                    {specialtyFilterOptions.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleFilterChange(item.id)}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: selectedSpecialty === item.id ? '2px solid #1e3a8a' : '2px solid #e2e8f0',
                                background: selectedSpecialty === item.id ? '#1e3a8a' : 'white',
                                color: selectedSpecialty === item.id ? 'white' : '#64748b',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedSpecialty !== item.id) {
                                    e.currentTarget.style.borderColor = '#1e3a8a';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedSpecialty !== item.id) {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 5. Results List */}
            <div>
                {isLoading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '4px solid #e2e8f0',
                            borderTop: '4px solid #1e3a8a',
                            borderRadius: '50%',
                            margin: '0 auto 1rem',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                        <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Finding Healthcare Facilities</h3>
                        <p style={{ color: '#94a3b8' }}>Searching for hospitals and doctors near you...</p>
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <>
                        <div style={{
                            background: '#f0f9ff',
                            padding: '1rem',
                            borderRadius: '10px',
                            marginBottom: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#0369a1', fontWeight: '600' }}>
                                Found {filteredDoctors.length} healthcare facilities nearby
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Within {searchRadius / 1000}km radius
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {filteredDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <FaUserMd size={30} color="white" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e3a8a', fontSize: '1.25rem' }}>{doctor.name}</h3>
                                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#64748b' }}>{doctor.specialty}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                                <FaStar color="#fbbf24" /> <span style={{ fontWeight: '600' }}>{doctor.rating}</span>
                                                <span style={{ color: '#94a3b8' }}>({doctor.reviews} reviews)</span>
                                            </div>
                                            <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                                                <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} /> {doctor.address}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                                                <FaPhone style={{ marginRight: '0.5rem' }} /> {doctor.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => handleGetDirections(doctor)}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.95rem',
                                                transition: 'background 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                                        >
                                            <FaDirections /> Directions
                                        </button>
                                        <button
                                            onClick={() => goToBookingPage(doctor)}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: '#1e3a8a',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                transition: 'background 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#1e3a8a'}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <FaUserMd style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }} />
                        <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No Healthcare Facilities Found</h3>
                        <p style={{ color: '#94a3b8' }}>Try adjusting your search criteria or location.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindDoctors;
