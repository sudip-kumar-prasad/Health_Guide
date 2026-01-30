# Health Guidance Web Application

## ⚠️ IMPORTANT DISCLAIMER
This platform provides informational health guidance only and does not replace professional medical advice. Always consult qualified healthcare professionals for medical concerns.

## Project Overview
A full-stack web application that provides informational health insights based on user-reported symptoms. The system offers general guidance while maintaining strict ethical boundaries and encouraging professional medical consultation.

## Features
- 🔐 User authentication (JWT-based)
- 👤 User profile management
- 📝 Symptom input & analysis
- 🏥 Doctor specialization recommendations
- 💊 General OTC medicine suggestions
- 🚨 Emergency alert system
- 📊 Health history dashboard
- 📄 PDF report generation

## Tech Stack
**Frontend:** React, Vite, CSS
**Backend:** Node.js, Express, JWT Authentication, Mongoose
**Database:** MongoDB
**Analysis:** Rule-based symptom matching

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

5. Create `.env` file in the backend directory:
```bash
cd ../backend
echo "MONGO_URI=mongodb://localhost:27017/health-guidance
JWT_SECRET=your_jwt_secret_here
PORT=5000" > .env
```

6. Run the application:
```bash
cd ..
npm run dev
```

This will start both frontend (port 5173) and backend (port 5000) servers.

## Project Structure
```
health-guide/
├── frontend/              # React Vite app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/            # Static assets
│   ├── index.html
│   └── package.json
├── backend/               # Node.js Express API
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Custom middleware (auth, etc)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── data/              # Static data
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root scripts
├── .gitignore
└── README.md
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/health-guidance
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

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

- `GET /` — Health check
- `POST /auth/signup` — User registration
- `POST /auth/login` — User login
- `GET /profile` — Get user profile (protected)
- `PUT /profile` — Update user profile (protected)
- `GET /api/symptoms` — Get all symptoms
- `POST /api/analyze` — Analyze symptoms

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
