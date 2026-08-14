const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');

const app = express();


// CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ks-ai-zeta.vercel.app'
    ],
    credentials: true
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());


// Routes
app.use('/user', userRoutes);


// Test route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'KS-AI Backend is running'
    });
});


module.exports = app;
