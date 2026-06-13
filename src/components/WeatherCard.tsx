'use client';

import React, { useState, useEffect } from 'react';
import { CurrentWeather } from '@/services/weatherService';
import WeatherIcon from './WeatherIcon';
import { translateNumber } from '@/utils/translate';
import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  current: CurrentWeather;
  cityName: string;
  countryName: string;
  timezone: string;
  tempMinToday: number;
  tempMaxToday: number;
  lang: string;
}

const conditionTranslations: { [key: string]: string } = {
  'clearsky': 'পরিষ্কার আকাশ',
  'fair': 'স্বচ্ছ আবহাওয়া',
  'partlycloudy': 'আংশিক মেঘলা',
  'cloudy': 'মেঘলা আকাশ',
  'rainshowers': 'বৃষ্টির সম্ভাবনা',
  'lightrainshowers': 'হালকা বৃষ্টিপাত',
  'heavyrainshowers': 'ভারী বৃষ্টিপাত',
  'rainandthunder': 'বজ্রবৃষ্টি',
  'lightsleetshowers': 'হালকা শিলাবৃষ্টি',
  'sleetshowers': 'শিলাবৃষ্টি',
  'lightsnowshowers': 'হালকা তুষারপাত',
  'snowshowers': 'তুষারপাত',
  'lightrain': 'হালকা বৃষ্টি',
  'rain': 'বৃষ্টি',
  'heavyrain': 'ভারী বৃষ্টি',
  'lightsleet': 'হালকা শিলাবৃষ্টি',
  'sleet': 'শিলাবৃষ্টি',
  'heavysleet': 'ভারী শিলাবৃষ্টি',
  'lightsnow': 'হালকা তুষার',
  'snow': 'তুষারপাত',
  'heavysnow': 'ভারী তুষারপাত',
  'fog': 'কুয়াশাচ্ছন্ন',
};

export default function WeatherCard({
  current,
  cityName,
  countryName,
  timezone,
  tempMinToday,
  tempMaxToday,
  lang,
}: WeatherCardProps) {
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: timezone,
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        };
        const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
        const formatter = new Intl.DateTimeFormat(locale, options);
        let timeStr = formatter.format(new Date());
        if (lang === 'bn') {
          timeStr = timeStr
            .replace(/am/gi, 'এএম')
            .replace(/pm/gi, 'পিএম')
            .replace(/পূর্বাহ্ণ/g, 'এএম')
            .replace(/অপরাহ্ণ/g, 'পিএম')
            .replace(/পূর্বাহ্ন/g, 'এএম')
            .replace(/অপরাহ্ন/g, 'পিএম');
        }
        setLocalTime(timeStr);
      } catch (err) {
        console.error('Timezone formatting error:', err);
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        };
        const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
        let timeStr = new Intl.DateTimeFormat(locale, options).format(new Date());
        if (lang === 'bn') {
          timeStr = timeStr
            .replace(/am/gi, 'এএম')
            .replace(/pm/gi, 'পিএম')
            .replace(/পূর্বাহ্ণ/g, 'এএম')
            .replace(/অপরাহ্ণ/g, 'পিএম')
            .replace(/পূর্বাহ্ন/g, 'এএম')
            .replace(/অপরাহ্ন/g, 'পিএম');
        }
        setLocalTime(timeStr);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timezone, lang]);

  const getConditionText = (symbolCode: string) => {
    const base = symbolCode.split('_')[0].toLowerCase();
    if (lang === 'bn' && conditionTranslations[base]) {
      return conditionTranslations[base];
    }

    const formatted = base
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .replace(/partlycloudy/i, 'Partly Cloudy')
      .replace(/clearsky/i, 'Clear Sky')
      .replace(/fair/i, 'Fair Weather')
      .replace(/rainshowers/i, 'Rain Showers')
      .replace(/heavyrainshowers/i, 'Heavy Rain Showers')
      .replace(/lightrainshowers/i, 'Light Rain Showers')
      .replace(/rainandthunder/i, 'Rain & Thunderstorms')
      .replace(/lightsleetshowers/i, 'Light Sleet Showers')
      .replace(/sleetshowers/i, 'Sleet Showers')
      .replace(/lightsnowshowers/i, 'Light Snow Showers')
      .replace(/snowshowers/i, 'Snow Showers')
      .replace(/lightrain/i, 'Light Rain')
      .replace(/heavyrain/i, 'Heavy Rain')
      .replace(/lightsleet/i, 'Light Sleet')
      .replace(/heavysleet/i, 'Heavy Sleet')
      .replace(/lightsnow/i, 'Light Snow')
      .replace(/heavysnow/i, 'Heavy Snow')
      .replace(/fog/i, 'Foggy');

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.cardHeader}>
        <div className={styles.locationInfo}>
          <h1 className={styles.city}>{cityName}</h1>
          <span className={styles.country}>{countryName}</span>
          {localTime && <div className={styles.date}>{localTime}</div>}
        </div>
        <WeatherIcon symbolCode={current.symbolCode} size={64} className={`animate-float ${styles.cardIcon}`} />
      </div>

      <div className={styles.weatherDetails}>
        <div className={styles.tempContainer}>
          <div className={styles.temp}>
            {translateNumber(Math.round(current.temp), lang)}
            <span className={styles.degree}>°</span>
          </div>
          <div className={styles.conditionText}>{getConditionText(current.symbolCode)}</div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.footerStat}>
          <span className={styles.statLabel}>{lang === 'bn' ? 'সর্বনিম্ন' : 'Low'}</span>
          <span className={styles.statValue}>
            {translateNumber(Math.round(tempMinToday), lang)}°
          </span>
        </div>
        <div className={styles.footerStat}>
          <span className={styles.statLabel}>{lang === 'bn' ? 'সর্বোচ্চ' : 'High'}</span>
          <span className={styles.statValue}>
            {translateNumber(Math.round(tempMaxToday), lang)}°
          </span>
        </div>
        <div className={styles.footerStat}>
          <span className={styles.statLabel}>{lang === 'bn' ? 'বাতাস' : 'Wind'}</span>
          <span className={styles.statValue}>
            {translateNumber(Math.round(current.windSpeed * 3.6), lang)}{' '}
            {lang === 'bn' ? 'কিমি/ঘণ্টা' : 'km/h'}
          </span>
        </div>
      </div>
    </div>
  );
}
