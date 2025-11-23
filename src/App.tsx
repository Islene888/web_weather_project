import React, { useState } from 'react';
import LocationSearch from './components/LocationSearch';
import WeatherDisplay from './components/WeatherDisplay';
import { WeatherData } from './types/weather';
import { getWeatherData } from './services/weatherService';
import './App.css';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = async (
    latitude: number,
    longitude: number,
    location: string
  ) => {
    setIsLoading(true);
    setError(null);
    setLocationName(location);

    try {
      const data = await getWeatherData(latitude, longitude);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setWeatherData(null);
    setLocationName('');
    setError(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌤️ Weather Forecast</h1>
        <p>Get accurate weather information for any city worldwide</p>
      </header>

      {!weatherData && !isLoading && (
        <LocationSearch onLocationSelect={handleLocationSelect} isLoading={isLoading} />
      )}

      {isLoading && (
        <div className="loading-container" role="status" aria-live="polite">
          <div className="loading-spinner">⏳</div>
          <p>Loading weather data for {locationName}...</p>
        </div>
      )}

      {error && (
        <div className="error-container" role="alert">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button
            onClick={handleReset}
            className="retry-button"
            type="button"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {weatherData && !isLoading && (
        <>
          <WeatherDisplay weatherData={weatherData} locationName={locationName} />
          <div className="actions-container">
            <button
              onClick={handleReset}
              className="new-search-button"
              type="button"
            >
              📍 Search Another Location
            </button>
          </div>
        </>
      )}

      <footer className="app-footer">
        <p>
          Weather data provided by{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open-Meteo website (opens in new tab)"
          >
            Open-Meteo
          </a>
        </p>
        <p>
          <a
            href="https://github.com/Islene888"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in new tab)"
          >
            Made by Islene888
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
