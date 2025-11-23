import React from 'react';
import { WeatherData, DailyForecast } from '../types/weather';
import { getWeatherDescription } from '../services/weatherService';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  locationName: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, locationName }) => {
  const { current, daily } = weatherData;
  const currentWeather = getWeatherDescription(current.weather_code);

  // Process daily forecast data
  const dailyForecasts: DailyForecast[] = daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    precipitationProbability: daily.precipitation_probability_max[index],
  }));

  const formatDate = (dateString: string, index: number): string => {
    const date = new Date(dateString);
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <main className="weather-display" role="main">
      <header className="weather-header">
        <h1>Weather in {locationName}</h1>
        <time className="update-time">
          Last updated: {new Date(current.time).toLocaleString()}
        </time>
      </header>

      <section className="current-weather" aria-label="Current weather conditions">
        <div className="current-main">
          <div className="temperature-display">
            <span className="current-temp" aria-label={`Current temperature ${Math.round(current.temperature_2m)} degrees Celsius`}>
              {Math.round(current.temperature_2m)}°C
            </span>
            <div className="weather-icon" aria-label={currentWeather.description}>
              {currentWeather.emoji}
            </div>
          </div>
          <div className="weather-description">
            <h2>{currentWeather.description}</h2>
          </div>
        </div>

        <div className="current-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">💧 Humidity</span>
              <span className="detail-value">{current.relative_humidity_2m}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🌧️ Precipitation</span>
              <span className="detail-value">{current.precipitation} mm</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💨 Wind Speed</span>
              <span className="detail-value">{Math.round(current.wind_speed_10m)} km/h</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🧭 Wind Direction</span>
              <span className="detail-value">
                {getWindDirection(current.wind_direction_10m)} ({Math.round(current.wind_direction_10m)}°)
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="forecast-section" aria-label="7-day weather forecast">
        <h2>7-Day Forecast</h2>
        <div className="forecast-grid">
          {dailyForecasts.map((forecast, index) => {
            const weather = getWeatherDescription(forecast.weatherCode);
            return (
              <article
                key={forecast.date}
                className={`forecast-card ${index === 0 ? 'today' : ''}`}
                aria-label={`Weather for ${formatDate(forecast.date, index)}`}
              >
                <header className="forecast-date">
                  {formatDate(forecast.date, index)}
                </header>
                <div className="forecast-weather">
                  <span
                    className="forecast-icon"
                    aria-label={weather.description}
                    title={weather.description}
                  >
                    {weather.emoji}
                  </span>
                </div>
                <div className="forecast-temps">
                  <span className="max-temp" aria-label={`High ${Math.round(forecast.maxTemp)} degrees`}>
                    {Math.round(forecast.maxTemp)}°
                  </span>
                  <span className="min-temp" aria-label={`Low ${Math.round(forecast.minTemp)} degrees`}>
                    {Math.round(forecast.minTemp)}°
                  </span>
                </div>
                <div className="precipitation-chance">
                  <span aria-label={`${forecast.precipitationProbability}% chance of rain`}>
                    💧 {forecast.precipitationProbability}%
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default WeatherDisplay;