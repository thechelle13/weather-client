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
      const apiKey = import.meta.env.VITE_REACT_APP_OPENWEATHERMAP_API_KEY;


      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=imperial`);
      const data = await response.json();

      // Update state with the received weather data
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <>
      <h1 className="font-inter text-4xl font-bold mb-8 text-gray-800">How's the Weather?</h1>

      <div className="bg-blue-400 rounded-lg shadow-md p-8 max-w-md">
        <div className="mb-6">
          <label htmlFor="zipCodeInput" className="block text-gray-700 font-bold mb-2">Enter ZIP Code:</label>
          <input
            type="text"
            id="zipCodeInput"
            name="zipCode"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="e.g., 12345"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button className="bg-blue-500 text-white rounded-full py-4 px-8 text-lg font-semibold transition-colors duration-300 hover:bg-blue-600" onClick={fetchWeatherData}>Get Weather</button>

        {weatherData && (
          <div className="bg-gray-100 p-4 rounded-md shadow-md my-4">
            <p className="text-xl font-semibold">Location: {weatherData.name}, {weatherData.sys.country}</p>
            <p className="text-lg">Time: {new Date(weatherData.dt * 1000).toLocaleTimeString()}</p>
            <img src={getWeatherIconUrl(weatherData.weather[0].icon)} alt="Weather Icon" className="inline-block w-8 h-8 mr-2" />
            <p className="text-3xl font-bold">Temperature: {weatherData.main.temp}&deg;F</p>
            <p>Feels Like: {weatherData.main.feels_like}&deg;F</p>
            <p className="text-lg">Weather: {weatherData.weather[0].description}</p>
            <p className="text-lg">Min Temperature: {weatherData.main.temp_min}&deg;F</p>
            <p className="text-lg">Max Temperature: {weatherData.main.temp_max}&deg;F</p>
            <p className="text-lg">Humidity: {weatherData.main.humidity}%</p>
            <p className="text-lg">Wind Speed: {weatherData.wind.speed} mph</p>
            <p className="text-lg">Visibility: {weatherData.visibility} </p>

            {weatherData.rain && <p className="text-lg">Rain (1h): {weatherData.rain["1h"]} inches</p>}
          </div>
        )}
      </div>
    </>
  );
};