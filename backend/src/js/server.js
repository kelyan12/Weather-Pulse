//constant
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weather_db';

//structure of the mongoDb model 
const favoriteSchema = new mongoose.Schema({
  cityName: String,
  country: String,
  latitude: Number,
  longitude: Number,
  addedAt: { type: Date, default: Date.now }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

//connection to mongoDB
const connectWithRetry = () => {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('Error', err.message);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

//TODO API THINGS