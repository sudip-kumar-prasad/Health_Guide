require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Health Guidance API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/health-guidance')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
