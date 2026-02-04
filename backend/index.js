require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'https://health-guide-8kzu.vercel.app'],
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/symptoms', require('./routes/symptomRoutes'));
app.use('/api/metrics', require('./routes/metricRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/wellness', require('./routes/wellnessRoutes'));

app.get('/', (req, res) => {
    res.send('Health Guidance API is running...');
});


// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/health-guidance')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
