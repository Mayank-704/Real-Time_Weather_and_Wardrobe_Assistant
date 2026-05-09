/**
 * Geocode Tool — Converts a city name to geographic coordinates
 * Uses the free Open-Meteo Geocoding API (no API key required).
 *
 * API Docs: https://open-meteo.com/en/docs/geocoding-api
 */

const GEOCODE_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Resolves a city name to latitude, longitude, and metadata.
 *
 * @param {string} cityName  The city to geocode (e.g. "Tokyo", "New York")
 * @returns {Promise<{name: string, latitude: number, longitude: number, country: string, timezone: string}>}
 */
async function geocodeCity(cityName) {
  const url = `${GEOCODE_BASE_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`Could not find a location matching "${cityName}". Please check the spelling.`);
  }

  const result = data.results[0];

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    timezone: result.timezone,
    admin1: result.admin1 || null, // State / Province
  };
}

export { geocodeCity };
