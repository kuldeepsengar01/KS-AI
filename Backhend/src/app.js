const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieparser());

// Routes
app.use('/user', userRoutes);

module.exports = app;