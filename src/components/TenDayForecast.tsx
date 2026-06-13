'use client';

import React from 'react';
import { DailyForecastItem } from '@/services/weatherService';
import WeatherIcon from './WeatherIcon';
import { Droplet } from 'lucide-react';
import { translateNumber } from '@/utils/translate';
import styles from './TenDayForecast.module.css';

interface TenDayForecastProps {
  daily: DailyForecastItem[];
  timezone: string;
  lang: string;
}

const conditionTranslations: { [key: string]: string } = {
  'STORMY': 'ঝড়ো',
  'SLEET': 'শিলাবৃষ্টি',
  'SNOWY': 'তুষারপাত',
  'HEAVY RAIN': 'ভারী বৃষ্টি',
  'RAINY': 'বৃষ্টিপাত',
  'DRIZZLE': 'গুঁড়ি বৃষ্টি',
  'FOGGY': 'কুয়াশা',
  'CLOUDY': 'মেঘলা',
  'PARTLY SUNNY': 'আংশিক রোদ',
  'SUNNY': 'রৌদ্রোজ্জ্বল',
  'CLEAR': 'পরিষ্কার আকাশ',
};

export default function TenDayForecast({ daily, timezone, lang }: TenDayForecastProps) {
  const getDayLabel = (dateStr: string, idx: number) => {
    if (idx === 0) return lang === 'bn' ? 'আজ' : 'TODAY';
    if (idx === 1) return lang === 'bn' ? 'আগামীকাল' : 'TOMORROW';

    try {
      const date = new Date(`${dateStr}T12:00:00`);
      const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date).toUpperCase();
    } catch (err) {
      console.error('Date parsing error:', err);
      return dateStr;
    }
  };

  const getShortCondition = (symbolCode: string) => {
    const base = symbolCode.split('_')[0].toLowerCase();
    
    let englishCond = 'CLEAR';
    if (base.includes('thunder')) englishCond = 'STORMY';
    else if (base.includes('sleet') || base.includes('hail')) englishCond = 'SLEET';
    else if (base.includes('snow')) englishCond = 'SNOWY';
    else if (base.includes('heavyrain')) englishCond = 'HEAVY RAIN';
    else if (base.includes('rain')) englishCond = 'RAINY';
    else if (base.includes('drizzle')) englishCond = 'DRIZZLE';
    else if (base.includes('fog')) englishCond = 'FOGGY';
    else if (base.includes('cloudy')) englishCond = 'CLOUDY';
    else if (base.includes('fair') || base.includes('partlycloudy')) englishCond = 'PARTLY SUNNY';
    else if (base.includes('clear') || base.includes('sun')) englishCond = 'SUNNY';
    
    if (lang === 'bn') {
      return conditionTranslations[englishCond] || englishCond;
    }
    return englishCond;
  };

  const getAlertText = (day: DailyForecastItem) => {
    const base = day.symbolCode.toLowerCase();
    if (lang === 'bn') {
      if (base.includes('thunder')) return '⚡ ঝড়-তুফান';
      if (day.precipitation >= 12) return '🌧️ বন্যা ঝুঁকি';
      if (day.precipitation >= 6) return '⚠️ ভারী বৃষ্টি';
      if (day.windSpeedMax >= 12) return '💨 ঝড়ো হাওয়া';
      if (day.windSpeedMax >= 8) return '💨 বাতাস';
      return null;
    }

    if (base.includes('thunder')) return '⚡ STORM';
    if (day.precipitation >= 12) return '🌧️ FLOOD RIS';
    if (day.precipitation >= 6) return '⚠️ HEAVY RN';
    if (day.windSpeedMax >= 12) return '💨 GALE WRN';
    if (day.windSpeedMax >= 8) return '💨 WINDY';
    return null;
  };

  return (
    <div className={`glass-panel ${styles.container}`}>
      {/* News Bulletin Header */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.newsBadge}>{lang === 'bn' ? 'সরাসরি' : 'LIVE'}</span>
          <h2 className={styles.title}>{lang === 'bn' ? '১০ দিনের পূর্বাভাস' : '10-Day Outlook'}</h2>
        </div>
      </div>

      {/* Grid of Weather Cards */}
      <div className={styles.grid}>
        {daily.map((day, idx) => {
          const alertText = getAlertText(day);
          const isToday = idx === 0;

          return (
            <div key={day.date} className={styles.card}>
              {/* Card Header (Weekday Name) */}
              <div className={`${styles.cardHeader} ${isToday ? styles.cardHeaderToday : ''}`}>
                {getDayLabel(day.date, idx)}
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                {/* Weather Symbol */}
                <div className={styles.iconContainer}>
                  <WeatherIcon symbolCode={day.symbolCode} size={34} className="animate-float" />
                </div>

                {/* Short Condition Caption */}
                <div className={styles.condition}>{getShortCondition(day.symbolCode)}</div>

                {/* Rain indicator (if any) */}
                {day.precipitation > 0 ? (
                  <span className={styles.precip} title={lang === 'bn' ? 'বৃষ্টিপাত' : 'Precipitation'}>
                    <Droplet size={10} fill="currentColor" />
                    {translateNumber(day.precipitation, lang)}{lang === 'bn' ? 'মিমি' : 'mm'}
                  </span>
                ) : (
                  <div style={{ height: '16px' }} />
                )}

                {/* Weather Alerts / Banners */}
                <div className={styles.alertWrapper}>
                  <div className={`${styles.alertBadge} ${!alertText ? styles.alertBadgeHidden : ''}`}>
                    {alertText || ''}
                  </div>
                </div>

                {/* Temperature Highs/Lows Split */}
                <div className={styles.tempContainer}>
                  <span className={`${styles.tempLabel} ${styles.maxTemp}`}>
                    {translateNumber(Math.round(day.tempMax), lang)}°
                  </span>
                  <span className={styles.tempDivider}>/</span>
                  <span className={`${styles.tempLabel} ${styles.minTemp}`}>
                    {translateNumber(Math.round(day.tempMin), lang)}°
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
