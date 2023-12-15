const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./TravellerPanel/Routes/userRoutes');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
mongoose.connect('mongodb+srv://abdullahdaniyal:superflies1234@cluster0.s5b7diq.mongodb.net/TravelManagement')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error', err));

// Routes
app.use('/user', userRoutes);

const port = 3000;
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
