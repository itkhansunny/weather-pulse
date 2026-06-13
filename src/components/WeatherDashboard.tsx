'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, CloudSun, Sun, Moon, Download } from 'lucide-react';
import { CityResult } from '@/services/geoService';
import { fetchWeatherData, WeatherData } from '@/services/weatherService';
import SearchAutocomplete from './SearchAutocomplete';
import WeatherCard from './WeatherCard';
import HourlyForecast from './HourlyForecast';
import TenDayForecast from './TenDayForecast';
import WeatherDetails from './WeatherDetails';
import { toPng } from 'html-to-image';
import styles from './WeatherDashboard.module.css';

// Default to Gafargaon, Bangladesh
const DEFAULT_CITY: CityResult = {
  id: 1185218,
  name: 'Gafargaon',
  latitude: 24.432,
  longitude: 90.5585,
  country: 'Bangladesh',
  country_code: 'BD',
  admin1: 'Mymensingh Division',
  timezone: 'Asia/Dhaka',
};

export default function WeatherDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<CityResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Switcher states (default to dark and english, loads from localStorage on mount)
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [appTheme, setAppTheme] = useState<'dark' | 'light'>('dark');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setAppTheme(savedTheme);
    }
    const savedLang = localStorage.getItem('app-lang');
    if (savedLang === 'en' || savedLang === 'bn') {
      setLang(savedLang);
    }
  }, []);

  // Update theme attribute on root document element
  useEffect(() => {
    document.documentElement.setAttribute('data-app-theme', appTheme);
    localStorage.setItem('app-theme', appTheme);
  }, [appTheme]);

  // Save language to localStorage on update
  useEffect(() => {
    localStorage.setItem('app-lang', lang);
  }, [lang]);

  const loadWeather = async (city: CityResult) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(
        lang === 'bn'
          ? 'আবহাওয়ার তথ্য লোড করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।'
          : err.message || 'An error occurred while fetching weather data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Load initial weather data
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity]);

  // Dynamically update weather theme attribute on document root based on weather condition
  useEffect(() => {
    if (weatherData?.current?.symbolCode) {
      const symbol = weatherData.current.symbolCode.split('_')[0].toLowerCase();
      let theme = 'default';

      if (symbol.includes('thunder')) {
        theme = 'stormy';
      } else if (symbol.includes('snow') || symbol.includes('sleet') || symbol.includes('hail')) {
        theme = 'snowy';
      } else if (symbol.includes('rain') || symbol.includes('drizzle') || symbol.includes('rainshowers')) {
        theme = 'rainy';
      } else if (symbol.includes('cloud') || symbol.includes('fog')) {
        theme = 'cloudy';
      } else if (symbol.includes('clear') || symbol.includes('fair')) {
        theme = 'clear';
      }

      document.documentElement.setAttribute('data-weather-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-weather-theme');
    }
  }, [weatherData]);

  const handleSavePNG = async () => {
    if (!dashboardRef.current) return;
    setSaving(true);
    try {
      // Add exporting class to hide scrollbars and controls in screenshot
      dashboardRef.current.classList.add('is-exporting');

      // A tiny delay to allow browser repaint/reflow before taking the screenshot
      await new Promise((resolve) => setTimeout(resolve, 50));

      const computedStyle = window.getComputedStyle(document.body);
      const bgGradient = computedStyle.backgroundImage || 'var(--bg-gradient)';

      const dataUrl = await toPng(dashboardRef.current, {
        cacheBust: true,
        style: {
          background: bgGradient,
          borderRadius: '0px',
        }
      });
      const link = document.createElement('a');
      link.download = `weather-${selectedCity.name.toLowerCase()}-${lang}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to save dashboard as image:', err);
      alert(lang === 'bn' ? 'ছবি সংরক্ষণ করতে ব্যর্থ হয়েছে।' : 'Failed to save dashboard image.');
    } finally {
      if (dashboardRef.current) {
        dashboardRef.current.classList.remove('is-exporting');
      }
      setSaving(false);
    }
  };

  const handleSelectCity = (city: CityResult) => {
    setSelectedCity(city);
  };

  // Localized city and country name for default city
  const displayCityName =
    selectedCity.name === 'Gafargaon' && lang === 'bn' ? 'গফরগাঁও' : selectedCity.name;
  const displayCountryName =
    selectedCity.country === 'Bangladesh' && lang === 'bn' ? 'বাংলাদেশ' : selectedCity.country;

  return (
    <div ref={dashboardRef} className={styles.wrapper}>
      {/* Header Bar */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <CloudSun size={28} className="animate-float" style={{ color: 'var(--accent)' }} />
          <span className={styles.brandName}>{lang === 'bn' ? 'আবহাওয়া পালস' : 'Weather Pulse'}</span>
        </div>

        <div className={styles.searchContainer}>
          <SearchAutocomplete onSelectCity={handleSelectCity} lang={lang} />
        </div>

        <div className={styles.controls}>
          {/* Language Switcher */}
          <button
            className={styles.controlBtn}
            onClick={() => setLang((prev) => (prev === 'en' ? 'bn' : 'en'))}
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            {lang === 'en' ? 'বাং' : 'EN'}
          </button>

          {/* Theme Switcher */}
          <button
            className={styles.controlBtn}
            onClick={() => setAppTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            title={appTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {appTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Save PNG Button */}
          <button
            className={styles.controlBtn}
            onClick={handleSavePNG}
            title={lang === 'bn' ? 'ছবি হিসেবে সংরক্ষণ করুন' : 'Save as PNG'}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={16} className={styles.spinner} />
            ) : (
              <Download size={16} />
            )}
          </button>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className={`glass-panel ${styles.loadingContainer}`}>
          <Loader2 size={40} className={styles.spinner} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            {lang === 'bn' ? 'আবহাওয়ার তথ্য লোড হচ্ছে...' : 'Retrieving live weather forecast...'}
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className={`glass-panel ${styles.errorContainer}`}>
          <AlertCircle size={40} style={{ color: '#ef4444' }} />
          <h3 className={styles.errorTitle}>
            {lang === 'bn' ? 'তথ্য লোড করা যায়নি' : 'Weather Retrieve Failed'}
          </h3>
          <p className={styles.errorMsg}>{error}</p>
          <button className={styles.retryBtn} onClick={() => loadWeather(selectedCity)}>
            {lang === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Main Dashboard Panel */}
      {!loading && !error && weatherData && (
        <main className={styles.dashboardContent}>
          <div className={styles.topSection}>
            {/* Left Column - Large Summary Card */}
            <div className={styles.leftColumn}>
              <WeatherCard
                current={weatherData.current}
                cityName={displayCityName}
                countryName={displayCountryName}
                timezone={selectedCity.timezone}
                tempMinToday={weatherData.daily[0]?.tempMin ?? weatherData.current.temp}
                tempMaxToday={weatherData.daily[0]?.tempMax ?? weatherData.current.temp}
                lang={lang}
              />
            </div>

            {/* Right Column - Hourly slider + secondary parameters */}
            <div className={styles.rightColumn}>
              <HourlyForecast hourly={weatherData.hourly} timezone={selectedCity.timezone} lang={lang} />
              <WeatherDetails current={weatherData.current} lang={lang} />
            </div>
          </div>

          {/* Full Width Bottom Section - News-style 10-Day Forecast */}
          <div className={styles.bottomSection}>
            <TenDayForecast daily={weatherData.daily} timezone={selectedCity.timezone} lang={lang} />
          </div>

        </main>
      )}
    </div>
  );
}
