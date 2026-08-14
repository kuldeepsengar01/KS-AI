const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');

const app = express();


// ================= CORS =================

const allowedOrigins = [
    'http://localhost:5173',
    'https://ks-ai-zeta.vercel.app',
    'https://ks-ai-git-main-kuldeepsengar01s-projects.vercel.app'
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without origin
            // Example: Postman / server-to-server
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

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


// ================= EXPORT =================

module.exports = app;
