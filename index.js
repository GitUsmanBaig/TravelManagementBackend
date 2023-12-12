const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser());
app.use(express.json());

// Database connection
mongoose.connect('mongodb+srv://abdullahdaniyal:superflies1234@cluster0.s5b7diq.mongodb.net/TravelManagement')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error', err));


const port = 3000;
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
