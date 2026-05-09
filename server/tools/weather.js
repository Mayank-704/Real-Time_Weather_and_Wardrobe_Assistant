/**
 * Weather Tool — Fetches current conditions and daily forecast
 * Uses the free Open-Meteo Forecast API (no API key required).
 *
 * API Docs: https://open-meteo.com/en/docs
 */

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * WMO Weather interpretation codes → human-readable descriptions.
 * Reference: https://open-meteo.com/en/docs#weathervariables
 */
const WMO_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

/**
 * Fetches current weather conditions and daily forecast for a location.
 *
 * @param {number} latitude       Latitude of the location
 * @param {number} longitude      Longitude of the location
 * @param {number} forecastDays   Number of forecast days (1–7)
 * @returns {Promise<object>}     Structured weather data
 */
async function getWeather(latitude, longitude, forecastDays = 1) {
  const days = Math.min(Math.max(forecastDays, 1), 7);

  const currentParams = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation",
    "weather_code",
    "wind_speed_10m",
    "uv_index",
  ].join(",");

  const dailyParams = [
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "precipitation_sum",
    "weather_code",
    "wind_speed_10m_max",
    "uv_index_max",
    "precipitation_probability_max",
  ].join(",");

  const url =
    `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=${currentParams}` +
    `&daily=${dailyParams}` +
    `&forecast_days=${days}` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  // Enrich weather codes with human-readable descriptions
  const enriched = {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    current: {
      ...data.current,
      weather_description: WMO_CODES[data.current?.weather_code] || "Unknown",
    },
    current_units: data.current_units,
    daily: {
      ...data.daily,
      weather_description: data.daily?.weather_code?.map(
        (code) => WMO_CODES[code] || "Unknown"
      ),
    },
    daily_units: data.daily_units,
  };

  return enriched;
}

export { getWeather };
