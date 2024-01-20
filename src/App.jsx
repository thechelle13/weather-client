import React, { useState } from 'react';
import './App.css';

export const App = () => {
  // const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  // const handleLocationChange = (event) => {
  //   setLocation(event.target.value);
  // };

  const fetchWeatherData = async () => {
    try {

      // Check if location is empty before making the request
        // if (!location.trim()) {
        //   window.alert('Please enter a location before getting the weather.');
        //   return;
        //   }

      // Make an HTTP request to your endpoint

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=36.1627&longitude=-86.7816&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);

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
          
            {/* <h2>Location: </h2>
            <input 
            type="text" 
            value={location} 
            onChange={handleLocationChange} 
            placeholder="e.g., Nashville, TN"
            required 
            /> */}

            <button onClick={fetchWeatherData}>Get Weather</button>
         
          {weatherData && (
            <div>
              {/* <p>Current Weather Information for {location}:</p> */}

              <p>Time: {weatherData.current.time}</p>
              <p>Temperature: {weatherData.current.temperature_2m}</p>
              <p>Wind Speed: {weatherData.current.wind_speed_10m}</p>

              {/* <p>Hourly Forecast:</p>
              <ul>
                {weatherData.hourly.time.map((time, index) => (
                  <li key={index}>
                    Time: {time}, Temperature: {weatherData.hourly.temperature_2m[index]}, Relative Humidity: {weatherData.hourly.relative_humidity_2m[index]}, Wind Speed: {weatherData.hourly.wind_speed_10m[index]}
                  </li>
                ))}
              </ul> */}

            </div>
          )}
        </div>
      </div>
    </>
  );
};