'use client';

import React from 'react';
import { CurrentWeather } from '@/services/weatherService';
import {
  Wind,
  Droplets,
  Sun,
  Gauge,
  Cloud,
  Thermometer,
  Navigation,
} from 'lucide-react';
import { translateNumber } from '@/utils/translate';
import styles from './WeatherDetails.module.css';

interface WeatherDetailsProps {
  current: CurrentWeather;
  lang: string;
}

export default function WeatherDetails({ current, lang }: WeatherDetailsProps) {
  // Convert wind degrees to cardinal direction
  const getWindDirectionCardinal = (deg: number) => {
    const directionsEn = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionsBn = ['উত্তর (N)', 'উত্তর-পূর্ব (NE)', 'পূর্ব (E)', 'দক্ষিণ-পূর্ব (SE)', 'দক্ষিণ (S)', 'দক্ষিণ-পশ্চিম (SW)', 'পশ্চিম (W)', 'উত্তর-পশ্চিম (NW)'];
    
    const index = Math.round(deg / 45) % 8;
    return lang === 'bn' ? directionsBn[index] : directionsEn[index];
  };

  // Get UV index descriptor
  const getUVDescriptor = (uv?: number) => {
    if (uv === undefined) return lang === 'bn' ? 'কোনো তথ্য নেই' : 'No data';
    
    if (lang === 'bn') {
      if (uv <= 2) return 'কম। অধিকাংশ ত্বকের জন্য নিরাপদ।';
      if (uv <= 5) return 'মাঝারি। সানস্ক্রিন ব্যবহার করুন।';
      if (uv <= 7) return 'বেশি। দুপুরে ছায়ায় থাকুন।';
      if (uv <= 10) return 'খুব বেশি। সতর্কতা জরুরি।';
      return 'অতিরিক্ত। সরাসরি রোদ এড়িয়ে চলুন।';
    }

    if (uv <= 2) return 'Low. Safe for most skin types.';
    if (uv <= 5) return 'Moderate. Wear sunscreen.';
    if (uv <= 7) return 'High. Seek shade midday.';
    if (uv <= 10) return 'Very High. Protection essential.';
    return 'Extreme. Avoid direct sun.';
  };

  // Get humidity descriptor
  const getHumidityDescriptor = (humidity: number) => {
    if (lang === 'bn') {
      if (humidity < 30) return 'শুষ্ক বাতাস। কিছুটা শুষ্কতা অনুভূত হতে পারে।';
      if (humidity <= 60) return 'স্বস্তিদায়ক। আদর্শ বাতাসের আর্দ্রতা।';
      if (humidity <= 80) return 'আঠালো ভাব। বাতাসে জলীয় বাষ্পের পরিমাণ বেশি।';
      return 'অতিরিক্ত আর্দ্র। ভারী ও স্যাঁতসেঁতে হাওয়া।';
    }

    if (humidity < 30) return 'Dry air. Feels comfortable but dry.';
    if (humidity <= 60) return 'Comfortable. Ideal humidity.';
    if (humidity <= 80) return 'Sticky. High moisture content.';
    return 'Very humid. Damp and heavy feel.';
  };

  // Get pressure descriptor
  const getPressureDescriptor = (pressure: number) => {
    if (lang === 'bn') {
      if (pressure < 1009) return 'নিম্নচাপ বলয়। বৃষ্টির জোরালো সম্ভাবনা।';
      if (pressure <= 1020) return 'স্বাভাবিক বায়ুমণ্ডলীয় চাপ।';
      return 'উচ্চচাপ বলয়। শান্ত ও মেঘমুক্ত আকাশ।';
    }

    if (pressure < 1009) return 'Low pressure system. Rainy weather likely.';
    if (pressure <= 1020) return 'Normal atmospheric pressure.';
    return 'High pressure system. Calm, clear skies.';
  };

  // Get cloud cover descriptor
  const getCloudCoverDescriptor = (clouds: number) => {
    if (lang === 'bn') {
      if (clouds < 10) return 'মেঘমুক্ত আকাশ। পুরোপুরি রৌদ্রোজ্জ্বল।';
      if (clouds <= 30) return 'অধিকাংশ সময় রোদ। হালকা মেঘ।';
      if (clouds <= 70) return 'আংশিক মেঘলা আকাশ।';
      if (clouds <= 90) return 'অধিকাংশ সময় মেঘলা আকাশ।';
      return 'পুরোপুরি মেঘাচ্ছন্ন আকাশ।';
    }

    if (clouds < 10) return 'Clear skies. Fully sunny.';
    if (clouds <= 30) return 'Mostly sunny. Sparse clouds.';
    if (clouds <= 70) return 'Partly cloudy skies.';
    if (clouds <= 90) return 'Mostly cloudy / overcast.';
    return 'Fully overcast skies.';
  };

  // Get UV index category details for badges
  const getUVCategory = (uv?: number) => {
    if (uv === undefined) {
      return {
        label: lang === 'bn' ? 'অপ্রাপ্য' : 'N/A',
        color: 'var(--text-secondary)',
        bg: 'rgba(255, 255, 255, 0.05)',
        border: 'var(--card-border)',
      };
    }
    const val = Math.round(uv);
    if (val <= 2) {
      return {
        label: lang === 'bn' ? 'কম' : 'Low',
        color: '#10b981', // green
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    }
    if (val <= 5) {
      return {
        label: lang === 'bn' ? 'মাঝারি' : 'Moderate',
        color: '#eab308', // yellow
        bg: 'rgba(234, 179, 8, 0.12)',
        border: 'rgba(234, 179, 8, 0.3)',
      };
    }
    if (val <= 7) {
      return {
        label: lang === 'bn' ? 'বেশি' : 'High',
        color: '#f97316', // orange
        bg: 'rgba(249, 115, 22, 0.12)',
        border: 'rgba(249, 115, 22, 0.3)',
      };
    }
    if (val <= 10) {
      return {
        label: lang === 'bn' ? 'খুব বেশি' : 'Very High',
        color: '#ef4444', // red
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.3)',
      };
    }
    return {
      label: lang === 'bn' ? 'অতিরিক্ত' : 'Extreme',
      color: '#a855f7', // purple
      bg: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.3)',
    };
  };

  // Get Humidity category details for badges
  const getHumidityCategory = (humidity: number) => {
    const val = Math.round(humidity);
    if (val < 30) {
      return {
        label: lang === 'bn' ? 'শুষ্ক' : 'Dry',
        color: '#f97316', // orange
        bg: 'rgba(249, 115, 22, 0.12)',
        border: 'rgba(249, 115, 22, 0.3)',
      };
    }
    if (val <= 60) {
      return {
        label: lang === 'bn' ? 'আদর্শ' : 'Ideal',
        color: '#10b981', // green
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    }
    if (val <= 80) {
      return {
        label: lang === 'bn' ? 'আঠালো' : 'Sticky',
        color: '#eab308', // yellow
        bg: 'rgba(234, 179, 8, 0.12)',
        border: 'rgba(234, 179, 8, 0.3)',
      };
    }
    return {
      label: lang === 'bn' ? 'অতিরিক্ত' : 'Humid',
      color: '#38bdf8', // light blue
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.3)',
    };
  };

  // Get Pressure category details for badges
  const getPressureCategory = (pressure: number) => {
    const val = Math.round(pressure);
    if (val < 1009) {
      return {
        label: lang === 'bn' ? 'নিম্ন' : 'Low',
        color: '#ef4444', // red
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.3)',
      };
    }
    if (val <= 1020) {
      return {
        label: lang === 'bn' ? 'স্বাভাবিক' : 'Normal',
        color: '#10b981', // green
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    }
    return {
      label: lang === 'bn' ? 'উচ্চ' : 'High',
      color: '#38bdf8', // light blue
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.3)',
    };
  };

  // Get Cloud Cover category details for badges
  const getCloudCoverCategory = (clouds: number) => {
    const val = Math.round(clouds);
    if (val < 10) {
      return {
        label: lang === 'bn' ? 'মেঘমুক্ত' : 'Clear',
        color: '#eab308', // yellow
        bg: 'rgba(234, 179, 8, 0.12)',
        border: 'rgba(234, 179, 8, 0.3)',
      };
    }
    if (val <= 30) {
      return {
        label: lang === 'bn' ? 'হালকা মেঘ' : 'Fair',
        color: '#10b981', // green
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    }
    if (val <= 70) {
      return {
        label: lang === 'bn' ? 'আংশিক' : 'Partly',
        color: '#38bdf8', // light blue
        bg: 'rgba(56, 189, 248, 0.12)',
        border: 'rgba(56, 189, 248, 0.3)',
      };
    }
    if (val <= 90) {
      return {
        label: lang === 'bn' ? 'মেঘলা' : 'Cloudy',
        color: '#94a3b8', // slate/gray
        bg: 'rgba(148, 163, 184, 0.12)',
        border: 'rgba(148, 163, 184, 0.3)',
      };
    }
    return {
      label: lang === 'bn' ? 'মেঘাচ্ছন্ন' : 'Overcast',
      color: '#64748b', // darker slate
      bg: 'rgba(100, 116, 139, 0.12)',
      border: 'rgba(100, 116, 139, 0.3)',
    };
  };

  // Get Dew Point category details for badges
  const getDewPointCategory = (dewPoint: number) => {
    const val = Math.round(dewPoint);
    if (val < 10) {
      return {
        label: lang === 'bn' ? 'শুষ্ক' : 'Dry',
        color: '#38bdf8', // light blue
        bg: 'rgba(56, 189, 248, 0.12)',
        border: 'rgba(56, 189, 248, 0.3)',
      };
    }
    if (val <= 15) {
      return {
        label: lang === 'bn' ? 'স্বস্তিদায়ক' : 'Pleasant',
        color: '#10b981', // green
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    }
    if (val <= 20) {
      return {
        label: lang === 'bn' ? 'আঠালো' : 'Sticky',
        color: '#f97316', // orange
        bg: 'rgba(249, 115, 22, 0.12)',
        border: 'rgba(249, 115, 22, 0.3)',
      };
    }
    return {
      label: lang === 'bn' ? 'অসহনীয়' : 'Oppressive',
      color: '#ef4444', // red
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
    };
  };

  // Get Dew Point descriptor
  const getDewPointDescriptor = (dewPoint: number) => {
    if (lang === 'bn') {
      if (dewPoint < 10) return 'বাতাস খুবই শুষ্ক এবং স্বস্তিদায়ক।';
      if (dewPoint <= 15) return 'আরামদায়ক পরিবেশ ও স্বাভাবিক আর্দ্রতা।';
      if (dewPoint <= 20) return 'সামান্য ভ্যাপসা গরম ও আঠালো অনুভূতি হতে পারে।';
      return 'অতিরিক্ত আর্দ্র ও অসহনীয় ভ্যাপসা গরম।';
    }

    if (dewPoint < 10) return 'Very dry and crisp air. Extremely comfortable.';
    if (dewPoint <= 15) return 'Comfortable. Ideal moisture level.';
    if (dewPoint <= 20) return 'Sticky and humid. Becoming noticeable.';
    return 'Oppressive humidity. Feels very muggy.';
  };

  const uvCat = getUVCategory(current.uvIndex);
  const humCat = getHumidityCategory(current.humidity);
  const presCat = getPressureCategory(current.pressure);
  const cloudCat = getCloudCoverCategory(current.cloudCover);
  const dewCat = getDewPointCategory(current.dewPoint);

  return (
    <div className={styles.grid}>
      {/* 1. Wind Detail Card */}
      <div className={`glass-panel ${styles.detailCard}`}>
        <div className={styles.cardHeader}>
          <Wind size={16} className={styles.icon} />
          <span>{lang === 'bn' ? 'বাতাস' : 'Wind'}</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.compassWrapper}>
            <div className={styles.compass}>
              {/* Cardinal direction labels */}
              <span className={`${styles.cardinal} ${styles.north}`}>N</span>
              <span className={`${styles.cardinal} ${styles.east}`}>E</span>
              <span className={`${styles.cardinal} ${styles.south}`}>S</span>
              <span className={`${styles.cardinal} ${styles.west}`}>W</span>
              
              {/* Subtle inner dial ring */}
              <div className={styles.ringTicks} />
              
              {/* Custom SVG Compass Needle */}
              <svg 
                viewBox="0 0 100 100" 
                className={styles.compassNeedle}
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              >
                {/* North arrow (Vibrant Accent) */}
                <polygon points="50,10 55,50 45,50" fill="var(--accent)" />
                {/* South arrow (Subtle slate) */}
                <polygon points="50,90 55,50 45,50" fill="var(--text-muted)" opacity="0.6" />
                {/* Center cap */}
                <circle cx="50" cy="50" r="7" fill="var(--text-primary)" />
                <circle cx="50" cy="50" r="3" fill="var(--card-bg)" />
              </svg>
            </div>
            <div>
              <div className={styles.value}>
                {translateNumber(Math.round(current.windSpeed * 3.6), lang)}
                <span className={styles.unit}>{lang === 'bn' ? 'কিমি/ঘ' : 'km/h'}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {getWindDirectionCardinal(current.windDirection)} ({translateNumber(current.windDirection, lang)}°)
              </div>
            </div>
          </div>
          <div className={styles.desc}>
            {current.windGust
              ? lang === 'bn'
                ? `সর্বোচ্চ দমকা হাওয়া ${translateNumber(Math.round(current.windGust * 3.6), lang)} কিমি/ঘ হতে পারে।`
                : `Gusts up to ${Math.round(current.windGust * 3.6)} km/h expected.`
              : lang === 'bn'
              ? 'ধীর ও শান্ত হাওয়া।'
              : 'Calm, steady breeze.'}
          </div>
        </div>
      </div>

      {/* 2. Humidity Detail Card */}
      <div className={`glass-panel ${styles.detailCard}`}>
        <div className={styles.cardHeader}>
          <Droplets size={16} className={styles.icon} />
          <span>{lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
        </div>
        <div className={styles.cardContent}>
          <div>
            <div className={styles.badgeValueContainer}>
              <span className={styles.value}>
                {translateNumber(Math.round(current.humidity), lang)}
                <span className={styles.unit}>%</span>
              </span>
              <span
                className={styles.statusBadge}
                style={{
                  backgroundColor: humCat.bg,
                  color: humCat.color,
                  borderColor: humCat.border,
                }}
              >
                <span className={styles.statusDot} style={{ backgroundColor: humCat.color }} />
                {humCat.label}
              </span>
            </div>
          </div>
          <div className={styles.desc}>{getHumidityDescriptor(current.humidity)}</div>
        </div>
      </div>

      {/* 3. UV Index Detail Card */}
      <div className={`glass-panel ${styles.detailCard}`}>
        <div className={styles.cardHeader}>
          <Sun size={16} className={styles.icon} />
          <span>{lang === 'bn' ? 'ইউভি সূচক' : 'UV Index'}</span>
        </div>
        <div className={styles.cardContent}>
          <div>
            {current.uvIndex !== undefined ? (
              <div className={styles.badgeValueContainer}>
                <span className={styles.value}>
                  {translateNumber(Math.round(current.uvIndex), lang)}
                </span>
                <span
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: uvCat.bg,
                    color: uvCat.color,
                    borderColor: uvCat.border,
                  }}
                >
                  <span className={styles.statusDot} style={{ backgroundColor: uvCat.color }} />
                  {uvCat.label}
                </span>
              </div>
            ) : (
              <div className={styles.value}>N/A</div>
            )}
          </div>
          <div className={styles.desc}>{getUVDescriptor(current.uvIndex)}</div>
        </div>
      </div>

      {/* 4. Pressure Detail Card */}
      <div className={`glass-panel ${styles.detailCard}`}>
        <div className={styles.cardHeader}>
          <Gauge size={16} className={styles.icon} />
          <span>{lang === 'bn' ? 'বায়ুচাপ' : 'Pressure'}</span>
        </div>
        <div className={styles.cardContent}>
          <div>
            <div className={styles.badgeValueContainer}>
              <span className={styles.value}>
                {translateNumber(Math.round(current.pressure), lang)}
                <span className={styles.unit}>{lang === 'bn' ? 'হেক্টোপাস্কাল' : 'hPa'}</span>
              </span>
              <span
                className={styles.statusBadge}
                style={{
                  backgroundColor: presCat.bg,
                  color: presCat.color,
                  borderColor: presCat.border,
                }}
              >
                <span className={styles.statusDot} style={{ backgroundColor: presCat.color }} />
                {presCat.label}
              </span>
            </div>
          </div>
          <div className={styles.desc}>{getPressureDescriptor(current.pressure)}</div>
        </div>
      </div>

      {/* 5. Cloud Cover Detail Card */}
      <div className={`glass-panel ${styles.detailCard}`}>
        <div className={styles.cardHeader}>
          <Cloud size={16} className={styles.icon} />
          <span>{lang === 'bn' ? 'মেঘের পরিমাণ' : 'Cloud Cover'}</span>
        </div>
        <div className={styles.cardContent}>
          <div>
            <div className={styles.badgeValueContainer}>
              <span className={styles.value}>
                {translateNumber(Math.round(current.cloudCover), lang)}
                <span className={styles.unit}>%</span>
              </span>
              <span
                className={styles.statusBadge}
                style={{
                  backgroundColor: cloudCat.bg,
                  color: cloudCat.color,
                  borderColor: cloudCat.border,
                }}
              >
                <span className={styles.statusDot} style={{ backgroundColor: cloudCat.color }} />
                {cloudCat.label}
              </span>
            </div>
          </div>
          <div className={styles.desc}>{getCloudCoverDescriptor(current.cloudCover)}</div>
        </div>
      </div>

      {/* 6. Dew Point Detail Card */}
      <div className={`glass-panel ${styles.detailCard}`}>
        <div className={styles.cardHeader}>
          <Thermometer size={16} className={styles.icon} />
          <span>{lang === 'bn' ? 'শিশিরাঙ্ক' : 'Dew Point'}</span>
        </div>
        <div className={styles.cardContent}>
          <div>
            <div className={styles.badgeValueContainer}>
              <span className={styles.value}>
                {translateNumber(Math.round(current.dewPoint), lang)}
                <span className={styles.unit}>°C</span>
              </span>
              <span
                className={styles.statusBadge}
                style={{
                  backgroundColor: dewCat.bg,
                  color: dewCat.color,
                  borderColor: dewCat.border,
                }}
              >
                <span className={styles.statusDot} style={{ backgroundColor: dewCat.color }} />
                {dewCat.label}
              </span>
            </div>
          </div>
          <div className={styles.desc}>{getDewPointDescriptor(current.dewPoint)}</div>
        </div>
      </div>
    </div>
  );
}
