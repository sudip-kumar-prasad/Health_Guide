# Health Guidance Web Application

## ⚠️ IMPORTANT DISCLAIMER
This platform provides informational health guidance only and does not replace professional medical advice. Always consult qualified healthcare professionals for medical concerns.

## Project Overview
A full-stack web application that provides informational health insights based on user-reported symptoms. The system offers general guidance while maintaining strict ethical boundaries and encouraging professional medical consultation.

## Features
- 🔐 **User Authentication** - Secure JWT-based registration and login
- 👤 **User Profile Management** - Personalized profile with health information
- 📝 **Symptom Analysis** - AI-powered symptom checking with detailed health insights
- 🏥 **Doctor Recommendations** - Specialization suggestions based on symptoms
- 💊 **Medicine Suggestions** - General OTC medicine recommendations
- 🚨 **Emergency Alert System** - Automatic detection of critical symptoms
- 📅 **Appointment Booking** - Schedule and manage healthcare appointments
- 💪 **Health Metrics Tracking** - Monitor BMI, blood pressure, heart rate, glucose levels
- 📊 **Health Analytics** - Visual dashboards with trends and insights using charts
- 💊 **Medication Tracker** - Track medications with dosage and reminder schedules
- 🗺️ **Find Nearby Doctors** - Geolocation-based search for nearby healthcare facilities using OpenStreetMap
- 🧘 **Wellness Logging** - Track mood, energy levels, sleep quality, and exercise
- 📜 **Health History** - Complete record of all symptom checks and analyses
- 📄 **PDF Report Generation** - Export health reports as PDF documents

## Tech Stack
**Frontend:** React 19, Vite 7, React Router, CSS  
**UI Libraries:** Recharts (charts), React Calendar, React Icons, React Toastify  
**Backend:** Node.js, Express 5, JWT Authentication, Mongoose  
**Database:** MongoDB (local or MongoDB Atlas)  
**File Upload:** Multer  
**Email:** Nodemailer  
**Scheduling:** Node-Cron  
**PDF Generation:** jsPDF with AutoTable  
**Geolocation:** OpenStreetMap Nominatim API  
**Analysis:** Rule-based symptom matching with severity detection

## Safety & Ethics
- No medical diagnoses provided
- No prescription medications suggested
- Clear disclaimers throughout the application
- Emergency alerts for severe symptoms
- Encourages professional medical consultation

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd Health_Guide
```

2. Install root dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Create environment files:

**Backend `.env` file:**
```bash
cd backend
echo "MONGO_URI=mongodb://localhost:27017/health-guidance
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development" > .env
```

**Frontend `.env` file:**
```bash
cd ../frontend
echo "VITE_API_URL=http://localhost:5000" > .env
```

6. Run the application:
```bash
cd ..
npm run dev
```

This will start both frontend (port 5173) and backend (port 5000) servers.

## Project Structure
```
Health_Guide/
├── frontend/              # React Vite app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   └── Navbar.jsx
│   │   ├── context/       # React context for state management
│   │   │   └── AuthContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SymptomCheck.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── HealthMetrics.jsx
│   │   │   ├── MedicationTracker.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   └── FindDoctors.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── config.js      # API configuration
│   ├── public/            # Static assets
│   ├── .env               # Environment variables
│   ├── index.html
│   └── package.json
├── backend/               # Node.js Express API
│   ├── controllers/       # Route handlers
│   │   ├── authController.js
│   │   ├── symptomController.js
│   │   ├── metricController.js
│   │   ├── appointmentController.js
│   │   ├── medicationController.js
│   │   └── wellnessController.js
│   ├── middleware/        # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   ├── SymptomRecord.js
│   │   ├── HealthMetric.js
│   │   ├── Appointment.js
│   │   ├── Medication.js
│   │   └── WellnessLog.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── symptomRoutes.js
│   │   ├── metricRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── medicationRoutes.js
│   │   └── wellnessRoutes.js
│   ├── utils/             # Utility functions
│   ├── data/              # Static data (symptoms, conditions)
│   ├── .env               # Environment variables
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root scripts
├── vercel.json            # Vercel deployment config
├── .gitignore
└── README.md
```

## Environment Variables

### Backend (`.env` in backend directory)
```env
MONGO_URI=mongodb://localhost:27017/health-guidance
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (`.env` in frontend directory)
```env
VITE_API_URL=http://localhost:5000
```

For production deployment, update `VITE_API_URL` to your deployed backend URL (e.g., Render, Railway, or Vercel).

## Scripts

**Root level:**
- `npm run dev` — Start both frontend and backend (if configured)
- `npm install` — Install all dependencies

**Frontend:**
```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

**Backend:**
```bash
cd backend
npm start        # Start server
npm run dev      # Start with nodemon (if configured)
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/signup` — User registration
- `POST /api/auth/login` — User login
- `GET /api/auth/profile` — Get user profile (protected)
- `PUT /api/auth/profile` — Update user profile (protected)

### Symptom Routes (`/api/symptoms`)
- `POST /api/symptoms/analyze` — Analyze symptoms and get health insights
- `GET /api/symptoms/history` — Get user's symptom check history (protected)
- `GET /api/symptoms/history/:id` — Get specific symptom record (protected)
- `DELETE /api/symptoms/history/:id` — Delete symptom record (protected)

### Health Metrics Routes (`/api/metrics`)
- `POST /api/metrics` — Add new health metric (protected)
- `GET /api/metrics` — Get all user's health metrics (protected)
- `GET /api/metrics/:id` — Get specific metric (protected)
- `PUT /api/metrics/:id` — Update metric (protected)
- `DELETE /api/metrics/:id` — Delete metric (protected)

### Appointment Routes (`/api/appointments`)
- `POST /api/appointments` — Book new appointment (protected)
- `GET /api/appointments` — Get all user's appointments (protected)
- `GET /api/appointments/:id` — Get specific appointment (protected)
- `PUT /api/appointments/:id` — Update appointment (protected)
- `DELETE /api/appointments/:id` — Cancel appointment (protected)

### Medication Routes (`/api/medications`)
- `POST /api/medications` — Add new medication (protected)
- `GET /api/medications` — Get all user's medications (protected)
- `GET /api/medications/:id` — Get specific medication (protected)
- `PUT /api/medications/:id` — Update medication (protected)
- `DELETE /api/medications/:id` — Delete medication (protected)

### Wellness Routes (`/api/wellness`)
- `POST /api/wellness` — Add wellness log entry (protected)
- `GET /api/wellness` — Get all user's wellness logs (protected)
- `GET /api/wellness/:id` — Get specific wellness log (protected)
- `DELETE /api/wellness/:id` — Delete wellness log (protected)

**Note:** Routes marked with (protected) require JWT authentication via Authorization header.

## Database Setup

### Local MongoDB
```bash
# Install MongoDB locally and run:
mongod
```

### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to backend/.env as MONGO_URI

## Running the Application

### Development Mode
```bash
# From root directory
npm run dev
```

### Production Build
```bash
cd frontend
npm run build

# Backend runs normally
cd ../backend
npm start
```

## License
MIT License - See LICENSE file for details

## Contributing
Pull requests welcome. For major changes, please open an issue first.

## Support
For issues or questions, please create an issue in the repository.
