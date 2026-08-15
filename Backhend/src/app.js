require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');

const app = express();


// ================= CORS =================

const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_PROD
].filter(Boolean);

console.log('Allowed Origins:', allowedOrigins);

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow Postman / server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            // Allow frontend
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log('Blocked Origin:', origin);

            return callback(new Error('Not allowed by CORS'));
        },

        credentials: true
    })
);


// ================= MIDDLEWARE =================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(morgan('dev'));

app.use(cookieParser());


// ================= ROUTES =================

app.use('/user', userRoutes);


// ================= TEST ROUTE =================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'KS-AI Backend is running'
    });
});


// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {

    console.error('ERROR:', err.message);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS Error: Frontend not allowed'
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});


// ================= EXPORT =================

module.exports = app;
