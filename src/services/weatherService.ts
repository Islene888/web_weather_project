import { WeatherData, LocationData, WeatherCode } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Weather code mappings based on WMO codes
export const weatherCodes: Record<number, WeatherCode> = {
  0: { description: 'Clear sky', emoji: '☀️' },
  1: { description: 'Mainly clear', emoji: '🌤️' },
  2: { description: 'Partly cloudy', emoji: '⛅' },
  3: { description: 'Overcast', emoji: '☁️' },
  45: { description: 'Fog', emoji: '🌫️' },
  48: { description: 'Depositing rime fog', emoji: '🌫️' },
  51: { description: 'Light drizzle', emoji: '🌦️' },
  53: { description: 'Moderate drizzle', emoji: '🌦️' },
  55: { description: 'Dense drizzle', emoji: '🌦️' },
  56: { description: 'Light freezing drizzle', emoji: '🌦️' },
  57: { description: 'Dense freezing drizzle', emoji: '🌦️' },
  61: { description: 'Slight rain', emoji: '🌧️' },
  63: { description: 'Moderate rain', emoji: '🌧️' },
  65: { description: 'Heavy rain', emoji: '🌧️' },
  66: { description: 'Light freezing rain', emoji: '🌧️' },
  67: { description: 'Heavy freezing rain', emoji: '🌧️' },
  71: { description: 'Slight snow fall', emoji: '🌨️' },
  73: { description: 'Moderate snow fall', emoji: '🌨️' },
  75: { description: 'Heavy snow fall', emoji: '🌨️' },
  77: { description: 'Snow grains', emoji: '🌨️' },
  80: { description: 'Slight rain showers', emoji: '🌦️' },
  81: { description: 'Moderate rain showers', emoji: '🌦️' },
  82: { description: 'Violent rain showers', emoji: '🌦️' },
  85: { description: 'Slight snow showers', emoji: '🌨️' },
  86: { description: 'Heavy snow showers', emoji: '🌨️' },
  95: { description: 'Thunderstorm', emoji: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', emoji: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', emoji: '⛈️' },
};

export const getWeatherDescription = (code: number): WeatherCode => {
  return weatherCodes[code] || { description: 'Unknown', emoji: '❓' };
};

export const searchLocations = async (query: string): Promise<LocationData> => {
  if (!query.trim()) {
    throw new Error('Location query is required');
  }

  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: LocationData = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations. Please check your internet connection.');
  }
};

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '7'
    });

    const response = await fetch(`${WEATHER_API}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
};