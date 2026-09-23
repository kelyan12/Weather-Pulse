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

//API

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'A city is required' });
  }

  try {
    //with that i can get the lat and lon of the city fetched
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {return res.status(404).json({ error: 'City not found' });}

    const location = geoData.results[0];
    const { latitude, longitude, name, country } = location;
    //fetch the meteo datas
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();

    res.json({
      cityName: name,
      country: country || '',
      latitude,
      longitude,
      temperature: weatherData.current_weather.temperature,
      windspeed: weatherData.current_weather.windspeed,
      weathercode: weatherData.current_weather.weathercode,
      time: weatherData.current_weather.time
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// fav cities
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await Favorite.find().sort({ addedAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorite cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO: Save the city in the favorites.

app.listen(PORT, () => {
  console.log(`Backend Weather API on ${PORT} port`);//to make sure
});