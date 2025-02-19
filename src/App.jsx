import React, { useState, useEffect } from 'react';
import './App.css';

export const App = () => {
  const [zipCode, setZipCode] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('day');

  // Determine theme based on current weather when data is loaded
  useEffect(() => {
    if (weatherData) {
      const icon = weatherData.weather[0].icon;
      // Night time condition
      if (icon.includes('n')) {
        setTheme('night');
      } else if (weatherData.weather[0].main === 'Rain' || weatherData.weather[0].main === 'Drizzle') {
        setTheme('rainy');
      } else if (weatherData.weather[0].main === 'Snow') {
        setTheme('snowy');
      } else if (weatherData.weather[0].main === 'Thunderstorm') {
        setTheme('stormy');
      } else if (weatherData.weather[0].main === 'Clouds' && weatherData.clouds.all > 50) {
        setTheme('cloudy');
      } else {
        setTheme('day');
      }
    }
  }, [weatherData]);

  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const fetchWeatherData = async () => {
    setError(null);
    
    // Check if ZIP code is empty before making the request
    if (!zipCode.trim()) {
      setError('Please enter a valid ZIP code');
      return;
    }

    try {
      setLoading(true);
      // Make an HTTP request to OpenWeatherMap API
      const apiKey = import.meta.env.VITE_REACT_APP_OPENWEATHERMAP_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=imperial`
      );
      
      const data = await response.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
      // Update state with the received weather data
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getBackgroundClass = () => {
    switch (theme) {
      case 'night':
        return 'bg-gradient-to-b from-indigo-900 to-blue-900';
      case 'rainy':
        return 'bg-gradient-to-b from-blue-800 to-gray-700';
      case 'snowy':
        return 'bg-gradient-to-b from-blue-100 to-blue-200';
      case 'stormy':
        return 'bg-gradient-to-b from-gray-800 to-gray-900';
      case 'cloudy':
        return 'bg-gradient-to-b from-gray-300 to-blue-200';
      default:
        return 'bg-gradient-to-b from-blue-400 to-blue-600';
    }
  };
  
  const getTextColorClass = () => {
    return theme === 'night' || theme === 'stormy' || theme === 'rainy' 
      ? 'text-white' 
      : 'text-gray-800';
  };

  const convertToMiles = (meters) => {
    return (meters / 1609.34).toFixed(1);
  };

  const getTemperatureColorClass = (temp) => {
    if (temp >= 90) return 'text-red-600';
    if (temp >= 80) return 'text-orange-500';
    if (temp >= 70) return 'text-yellow-500';
    if (temp >= 60) return 'text-green-500';
    if (temp >= 40) return 'text-blue-400';
    return 'text-blue-600';
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${getBackgroundClass()} transition-all duration-500 p-4`}>
      <div className="container max-w-md w-full">
        <h1 className={`text-4xl font-bold mb-8 text-center ${getTextColorClass()}`}>
          Weather Forecast
        </h1>

        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              id="zipCodeInput"
              name="zipCode"
              value={zipCode}
              onChange={handleZipCodeChange}
              placeholder="Enter ZIP code"
              className="shadow-sm border border-gray-300 rounded-lg py-3 px-4 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && fetchWeatherData()}
            />
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Get Weather'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p>{error}</p>
            </div>
          )}
        </div>

        {weatherData && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform hover:scale-102 animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {new Date(weatherData.dt * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src={getWeatherIconUrl(weatherData.weather[0].icon)} 
                    alt={weatherData.weather[0].description}
                    className="w-16 h-16" 
                  />
                  <p className="text-sm font-medium text-gray-700 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`text-5xl font-bold ${getTemperatureColorClass(weatherData.main.temp)}`}>
                      {Math.round(weatherData.main.temp)}°F
                    </span>
                    <span className="text-gray-500 ml-2">
                      Feels like {Math.round(weatherData.main.feels_like)}°F
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end text-gray-600">
                      <span className="text-blue-500 mr-1">↓</span> {Math.round(weatherData.main.temp_min)}°F
                      <span className="mx-2">|</span>
                      <span className="text-red-500 mr-1">↑</span> {Math.round(weatherData.main.temp_max)}°F
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-100/80 p-3 rounded-lg flex flex-col items-center">
                  <span className="text-gray-500 text-sm">Humidity</span>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold text-gray-800">{weatherData.main.humidity}%</span>
                  </div>
                </div>
                
                <div className="bg-gray-100/80 p-3 rounded-lg flex flex-col items-center">
                  <span className="text-gray-500 text-sm">Wind</span>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold text-gray-800">{weatherData.wind.speed}</span>
                    <span className="text-gray-600 ml-1 text-sm">mph</span>
                  </div>
                </div>
                
                <div className="bg-gray-100/80 p-3 rounded-lg flex flex-col items-center">
                  <span className="text-gray-500 text-sm">Visibility</span>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold text-gray-800">
                      {convertToMiles(weatherData.visibility)}
                    </span>
                    <span className="text-gray-600 ml-1 text-sm">mi</span>
                  </div>
                </div>
                
                <div className="bg-gray-100/80 p-3 rounded-lg flex flex-col items-center">
                  <span className="text-gray-500 text-sm">Pressure</span>
                  <div className="flex items-baseline">
                    <span className="text-xl font-semibold text-gray-800">
                      {weatherData.main.pressure}
                    </span>
                    <span className="text-gray-600 ml-1 text-sm">hPa</span>
                  </div>
                </div>
              </div>

              {weatherData.rain && (
                <div className="mt-4 bg-blue-100/80 p-3 rounded-lg">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span className="text-xl font-semibold text-blue-800">
                      {weatherData.rain["1h"]} in
                    </span>
                    <span className="text-blue-600 ml-2">rainfall in last hour</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-100/80">
              <p className="text-sm text-gray-600 text-center">
                Data provided by OpenWeather API • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};