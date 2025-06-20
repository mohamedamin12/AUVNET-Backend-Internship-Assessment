const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

const connectToDB = () => {
     mongoose.connect(url);
    console.log('connected to db');
} 

module.exports = connectToDB;