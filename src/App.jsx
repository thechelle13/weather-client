import React, { useState } from 'react';
import './App.css';

export const App = () => {
  const [zipCode, setZipCode] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const fetchWeatherData = async () => {
    try {
      // Check if ZIP code is empty before making the request
      if (!zipCode.trim()) {
        window.alert('Please enter a ZIP code before getting the weather.');
        return;
      }

      // Make an HTTP request to OpenWeatherMap API
      const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=imperial`);
      const data = await response.json();

      // Update state with the received weather data
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <>
      <div className="center-container">
        <h1>How's the Weather?</h1>
        <div className="card">
         
          <div className="input-container">
          <div>Enter ZIP Code: </div>
            <input
              type="text"
              value={zipCode}
              onChange={handleZipCodeChange}
              placeholder="e.g., 12345"
              required
            />
            
          </div>
          <button onClick={fetchWeatherData}>Get Weather</button>
          {weatherData && (
             <div className="bg-gray-100 p-4 rounded-md shadow-md">
             <p className="text-xl font-semibold">Location: {weatherData.name}, {weatherData.sys.country}</p>
             <p className="text-lg">Time: {new Date(weatherData.dt * 1000).toLocaleTimeString()}</p>
             <p className="text-3xl font-bold">Temperature: {weatherData.main.temp}&deg;F</p>
             <p className="text-lg">Weather: {weatherData.weather[0].description}</p>
             <p className="text-lg">Min Temperature: {weatherData.main.temp_min}&deg;F</p>
             <p className="text-lg">Max Temperature: {weatherData.main.temp_max}&deg;F</p>
             <p className="text-lg">Humidity: {weatherData.main.humidity}%</p>
             <p className="text-lg">Wind Speed: {weatherData.wind.speed} mph</p>
             {weatherData.rain && <p className="text-lg">Rain (1h): {weatherData.rain["1h"]} inches</p>}
           </div>
          )}

        </div>
      </div>
    </>
  );
};
