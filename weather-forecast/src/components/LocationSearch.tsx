import React, { useState, useCallback, useRef } from 'react';
import { LocationData } from '../types/weather';
import { searchLocations } from '../services/weatherService';

interface LocationSearchProps {
  onLocationSelect: (latitude: number, longitude: number, locationName: string) => void;
  isLoading: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData['results']>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        if (searchQuery.length < 2) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        setIsSearching(true);
        setError(null);

        try {
          const data = await searchLocations(searchQuery);
          setSuggestions(data.results || []);
          setShowSuggestions(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Search failed');
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleLocationSelect = (location: NonNullable<LocationData['results']>[0]) => {
    const locationName = `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}${
      location.country ? `, ${location.country}` : ''
    }`;
    setQuery(locationName);
    setShowSuggestions(false);
    onLocationSelect(location.latitude, location.longitude, locationName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions && suggestions.length > 0) {
      handleLocationSelect(suggestions[0]);
    }
  };

  return (
    <section className="location-search" aria-label="Location search">
      <form onSubmit={handleSubmit} role="search">
        <div className="search-container">
          <label htmlFor="location-input" className="search-label">
            Search for a city to get weather forecast
          </label>
          <div className="input-container">
            <input
              id="location-input"
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter city name (e.g., London, New York, Tokyo)"
              className="search-input"
              disabled={isLoading}
              autoComplete="off"
              aria-describedby={error ? 'search-error' : 'search-help'}
            />
            <button
              type="submit"
              className="search-button"
              disabled={isLoading || isSearching || !query.trim()}
              aria-label="Search for weather"
            >
              {isLoading || isSearching ? (
                <span className="spinner" aria-hidden="true">🔍</span>
              ) : (
                '🔍'
              )}
            </button>
          </div>

          {!error && (
            <p id="search-help" className="search-help">
              Start typing to see location suggestions
            </p>
          )}

          {error && (
            <p id="search-error" className="error-message" role="alert">
              ❌ {error}
            </p>
          )}
        </div>
      </form>

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <ul className="suggestions-list" role="listbox" aria-label="Location suggestions">
          {suggestions.slice(0, 5).map((location) => {
            const locationName = `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}${
              location.country ? `, ${location.country}` : ''
            }`;
            return (
              <li key={location.id} className="suggestion-item">
                <button
                  type="button"
                  className="suggestion-button"
                  onClick={() => handleLocationSelect(location)}
                  role="option"
                  aria-selected="false"
                >
                  📍 {locationName}
                  {location.population && (
                    <span className="population"> (Pop: {location.population.toLocaleString()})</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default LocationSearch;