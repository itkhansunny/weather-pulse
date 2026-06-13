import React from 'react';
import { HourlyForecastItem } from '@/services/weatherService';
import WeatherIcon from './WeatherIcon';
import { Droplet } from 'lucide-react';
import { translateNumber } from '@/utils/translate';
import styles from './HourlyForecast.module.css';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  timezone: string;
  lang: string;
}

export default function HourlyForecast({ hourly, timezone, lang }: HourlyForecastProps) {
  const formatHour = (isoString: string, idx: number) => {
    if (idx === 0) return lang === 'bn' ? 'এখন' : 'Now';

    let formatted = '';
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: 'numeric',
        hour12: true,
      };
      const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
      formatted = new Intl.DateTimeFormat(locale, options).format(new Date(isoString));
    } catch (err) {
      console.error('Error formatting hour:', err);
      const date = new Date(isoString);
      const hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      formatted = translateNumber(displayHour, lang) + ' ' + ampm;
    }

    if (lang === 'bn') {
      formatted = formatted
        .replace(/am/gi, 'এএম')
        .replace(/pm/gi, 'পিএম')
        .replace(/পূর্বাহ্ণ/g, 'এএম')
        .replace(/অপরাহ্ণ/g, 'পিএম')
        .replace(/পূর্বাহ্ন/g, 'এএম')
        .replace(/অপরাহ্ন/g, 'পিএম');
    }
    return formatted;
  };

  return (
    <div className={`glass-panel ${styles.container}`}>
      <h2 className={styles.title}>{lang === 'bn' ? 'ঘণ্টাভিত্তিক পূর্বাভাস' : 'Hourly Forecast'}</h2>
      <div className={styles.scrollWrapper}>
        {hourly.map((item, idx) => (
          <div key={item.time} className={styles.hourItem}>
            <span className={styles.time}>{formatHour(item.time, idx)}</span>
            <WeatherIcon symbolCode={item.symbolCode} size={28} className="animate-pulse-slow" />
            <span className={styles.temp}>{translateNumber(Math.round(item.temp), lang)}°</span>
            {item.precipitation > 0 ? (
              <span className={styles.precip} title={lang === 'bn' ? 'বৃষ্টিপাত' : 'Precipitation'}>
                <Droplet size={10} fill="currentColor" />
                {translateNumber(item.precipitation, lang)}
              </span>
            ) : (
              <div className={styles.precipEmpty} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
