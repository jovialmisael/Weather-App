import { useState, useCallback, useEffect } from 'react';

// ==========================================
// PASTE YOUR WEATHERAPI.COM API KEY BELOW
// ==========================================
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "7f4b7d094718498f87385624263103";

const BASE_URL = 'https://api.weatherapi.com/v1';

export function useWeather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // metric (C) or imperial (F)

  const fetchWeatherData = useCallback(async (params) => {
    if (!API_KEY) {
      setError("Please paste your WeatherAPI API Key at the top of src/hooks/useWeather.js");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = params.q || `${params.lat},${params.lon}`;
      const queryParams = new URLSearchParams({
        key: API_KEY,
        q: q,
        days: 5,
        aqi: 'no',
        alerts: 'no'
      }).toString();

      const res = await fetch(`${BASE_URL}/forecast.json?${queryParams}`);

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
             throw new Error("Invalid API Key, or your new key hasn't activated yet.");
        }
        throw new Error(res.status === 400 ? "City not found." : "Failed to fetch weather data. Please try again.");
      }

      const rawData = await res.json();
      const isMetric = unit === 'metric';

      const mapCondition = (text) => {
        const t = text.toLowerCase();
        if (t.includes('rain') || t.includes('drizzle')) return 'Rain';
        if (t.includes('snow') || t.includes('ice') || t.includes('blizzard') || t.includes('sleet')) return 'Snow';
        if (t.includes('thunder') || t.includes('storm')) return 'Storm';
        if (t.includes('cloud') || t.includes('overcast')) return 'Clouds';
        return 'Clear';
      };

      const parseTimeToUnix = (timeStr, dateStr) => {
        try {
          return new Date(`${dateStr} ${timeStr}`).getTime() / 1000;
        } catch(e) { return 0; }
      };

      const dateStr = rawData.location.localtime.split(' ')[0];

      const current = {
        name: rawData.location.name,
        dt: rawData.current.last_updated_epoch,
        main: {
          temp: isMetric ? rawData.current.temp_c : rawData.current.temp_f,
          feels_like: isMetric ? rawData.current.feelslike_c : rawData.current.feelslike_f,
          humidity: rawData.current.humidity,
          pressure: rawData.current.pressure_mb
        },
        weather: [{
          main: mapCondition(rawData.current.condition.text),
          description: rawData.current.condition.text
        }],
        wind: {
          speed: isMetric ? (rawData.current.wind_kph / 3.6) : rawData.current.wind_mph,
          deg: rawData.current.wind_degree
        },
        visibility: isMetric ? (rawData.current.vis_km * 1000) : (rawData.current.vis_miles * 1609.34),
        sys: {
          sunrise: parseTimeToUnix(rawData.forecast.forecastday[0].astro.sunrise, dateStr),
          sunset: parseTimeToUnix(rawData.forecast.forecastday[0].astro.sunset, dateStr)
        }
      };

      const forecast = rawData.forecast.forecastday.map(d => ({
        dt: d.date_epoch,
        temp_min: isMetric ? d.day.mintemp_c : d.day.mintemp_f,
        temp_max: isMetric ? d.day.maxtemp_c : d.day.maxtemp_f,
        condition: mapCondition(d.day.condition.text)
      }));

      setData({ current, forecast });
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const fetchByCity = useCallback((city) => {
    if (!city) return;
    fetchWeatherData({ q: city });
  }, [fetchWeatherData]);

  const fetchByLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (err) => {
        setError("Location access denied or unavailable.");
        setLoading(false);
      }
    );
  }, [fetchWeatherData]);

  // Initial load (maybe prompt location or load default city like London)
  useEffect(() => {
    if (!data && !error && !loading) {
      fetchByCity('London');
    }
  }, [fetchByCity, data, error, loading]);

  // Refetch when unit changes
  const [lastParams, setLastParams] = useState(null);

  // To handle unit refetch elegantly, we could store the last searched lat/lon or city.
  // Realistically for a beautiful UX, unit swap can just mathematically convert the cached data if we want true instant UI,
  // but let's stick to API fetch for simplicity. We need to save the current search target.
  const fetchWithParamsSafe = useCallback((params) => {
    setLastParams(params);
    fetchWeatherData(params);
  }, [fetchWeatherData]);

  const fetchCityWrapped = useCallback((city) => {
    setLastParams({ q: city });
    fetchWeatherData({ q: city });
  }, [fetchWeatherData]);

  const fetchLocWrapped = useCallback(() => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const p = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setLastParams(p);
        fetchWeatherData(p);
      },
      (err) => {
        setError("Location access denied.");
        setLoading(false);
      }
    );
  }, [fetchWeatherData]);

  // Re-fetch only if unit changes and we already have a successful search params set
  useEffect(() => {
    if (lastParams) {
      fetchWeatherData(lastParams);
    }
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    fetchByCity: fetchCityWrapped,
    fetchByLocation: fetchLocWrapped,
    unit,
    setUnit
  };
}
