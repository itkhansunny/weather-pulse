'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Compass, CompassIcon, ArrowUp, ArrowDown, Eye, Clock } from 'lucide-react';
import SunCalc from 'suncalc';
import { translateNumber } from '@/utils/translate';
import styles from './CelestialTracker.module.css';

interface CelestialTrackerProps {
  latitude: number;
  longitude: number;
  timezone: string;
  lang: string;
}

export default function CelestialTracker({
  latitude,
  longitude,
  timezone,
  lang,
}: CelestialTrackerProps) {
  const [activeTab, setActiveTab] = useState<'sun' | 'moon'>('sun');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update time every 30 seconds to keep positions fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // 1. Calculate Sun & Moon Data using SunCalc
  let sunPos = { altitude: 0, azimuth: 0 };
  let moonPos = { altitude: 0, azimuth: 0 };
  let moonIllum = { fraction: 0, phase: 0 };
  let sunTimes = { sunrise: new Date(), sunset: new Date() };

  try {
    sunPos = SunCalc.getPosition(currentTime, latitude, longitude);
    moonPos = SunCalc.getMoonPosition(currentTime, latitude, longitude);
    moonIllum = SunCalc.getMoonIllumination(currentTime);
    sunTimes = SunCalc.getTimes(currentTime, latitude, longitude);
  } catch (err) {
    console.error('Error calculating celestial data:', err);
  }

  // Convert radians to degrees
  const sunAltDeg = (sunPos.altitude * 180) / Math.PI;
  const sunAzDeg = ((sunPos.azimuth * 180) / Math.PI + 180) % 360;

  const moonAltDeg = (moonPos.altitude * 180) / Math.PI;
  const moonAzDeg = ((moonPos.azimuth * 180) / Math.PI + 180) % 360;

  const isDay = sunAltDeg > 0;

  // Cardinal directions lookup
  const getCardinal = (deg: number) => {
    const directionsEn = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionsBn = ['উত্তর (N)', 'উত্তর-পূর্ব (NE)', 'পূর্ব (E)', 'দক্ষিণ-পূর্ব (SE)', 'দক্ষিণ (S)', 'দক্ষিণ-পশ্চিম (SW)', 'পশ্চিম (W)', 'উত্তর-পশ্চিম (NW)'];
    const index = Math.round(deg / 45) % 8;
    return lang === 'bn' ? directionsBn[index] : directionsEn[index];
  };

  // Moon phase translations & names
  const getMoonPhaseName = (phase: number) => {
    if (phase < 0.03 || phase > 0.97) {
      return lang === 'bn' ? 'অমাবস্যা (New Moon)' : 'New Moon';
    } else if (phase >= 0.03 && phase < 0.22) {
      return lang === 'bn' ? 'শুক্লপক্ষীয় ক্রিসেন্ট (Waxing Crescent)' : 'Waxing Crescent';
    } else if (phase >= 0.22 && phase < 0.28) {
      return lang === 'bn' ? 'প্রথম চতুর্থাংশ (First Quarter)' : 'First Quarter';
    } else if (phase >= 0.28 && phase < 0.47) {
      return lang === 'bn' ? 'শুক্লপক্ষীয় গিব্বাস (Waxing Gibbous)' : 'Waxing Gibbous';
    } else if (phase >= 0.47 && phase < 0.53) {
      return lang === 'bn' ? 'পূর্ণিমা (Full Moon)' : 'Full Moon';
    } else if (phase >= 0.53 && phase < 0.72) {
      return lang === 'bn' ? 'কৃষ্ণপক্ষীয় গিব্বাস (Waning Gibbous)' : 'Waning Gibbous';
    } else if (phase >= 0.72 && phase < 0.78) {
      return lang === 'bn' ? 'শেষ চতুর্থাংশ (Last Quarter)' : 'Last Quarter';
    } else {
      return lang === 'bn' ? 'কৃষ্ণপক্ষীয় ক্রিসেন্ট (Waning Crescent)' : 'Waning Crescent';
    }
  };

  // Helper: Format local times based on the target timezone
  const formatLocalTime = (date: Date | null | undefined) => {
    if (!date || isNaN(date.getTime())) return '--:--';
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
      const formatter = new Intl.DateTimeFormat(locale, options);
      let timeStr = formatter.format(date);
      if (lang === 'bn') {
        timeStr = timeStr
          .replace(/am/gi, 'এএম')
          .replace(/pm/gi, 'পিএম')
          .replace(/পূর্বাহ্ণ/g, 'এএম')
          .replace(/অপরাহ্ণ/g, 'পিএম')
          .replace(/পূর্বাহ্ন/g, 'এএম')
          .replace(/অপরাহ্ন/g, 'পিএম');
      }
      return timeStr;
    } catch (err) {
      console.error('Timezone format error in celestial tracker:', err);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Helper: Get day length string
  const getDayLength = () => {
    const rise = sunTimes.sunrise;
    const set = sunTimes.sunset;
    if (!rise || !set || isNaN(rise.getTime()) || isNaN(set.getTime())) return '--';
    const diffMs = set.getTime() - rise.getTime();
    if (diffMs <= 0) return lang === 'bn' ? '২৪ ঘণ্টা রোদ/অন্ধকার' : '24h light/dark';
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    if (lang === 'bn') {
      return `${translateNumber(diffHrs, 'bn')} ঘণ্টা ${translateNumber(diffMins, 'bn')} মিনিট`;
    }
    return `${diffHrs}h ${diffMins}m`;
  };

  // Helper: Event countdown
  const getNextEventText = () => {
    const now = currentTime.getTime();
    const rise = sunTimes.sunrise.getTime();
    const set = sunTimes.sunset.getTime();

    if (now < rise) {
      const diffMin = Math.round((rise - now) / 60000);
      const h = Math.floor(diffMin / 60);
      const m = diffMin % 60;
      if (lang === 'bn') {
        return `সূর্যোদয় ${h > 0 ? translateNumber(h, 'bn') + ' ঘণ্টা ' : ''}${translateNumber(m, 'bn')} মিনিটে`;
      }
      return `Sunrise in ${h > 0 ? h + 'h ' : ''}${m}m`;
    } else if (now < set) {
      const diffMin = Math.round((set - now) / 60000);
      const h = Math.floor(diffMin / 60);
      const m = diffMin % 60;
      if (lang === 'bn') {
        return `সূর্যাস্ত ${h > 0 ? translateNumber(h, 'bn') + ' ঘণ্টা ' : ''}${translateNumber(m, 'bn')} মিনিটে`;
      }
      return `Sunset in ${h > 0 ? h + 'h ' : ''}${m}m`;
    } else {
      // Find next day's sunrise approximately
      const nextRise = rise + 86400000;
      const diffMin = Math.round((nextRise - now) / 60000);
      const h = Math.floor(diffMin / 60);
      const m = diffMin % 60;
      if (lang === 'bn') {
        return `সূর্যোদয় ${h > 0 ? translateNumber(h, 'bn') + ' ঘণ্টা ' : ''}${translateNumber(m, 'bn')} মিনিটে`;
      }
      return `Sunrise in ${h > 0 ? h + 'h ' : ''}${m}m`;
    }
  };

  // Calculate Sun Position on the visual Arc
  // Path starts at (20, 100), peaks at (150, 15), ends at (280, 100)
  // Parametric ellipse: x = 150 - 130 * cos(pi * progress), y = 100 - 85 * sin(pi * progress)
  let sunX = 150;
  let sunY = 100;
  let sunProgress = 0.5;

  if (nowIsDaytime(currentTime, sunTimes.sunrise, sunTimes.sunset)) {
    const riseMs = sunTimes.sunrise.getTime();
    const setMs = sunTimes.sunset.getTime();
    const currentMs = currentTime.getTime();
    sunProgress = (currentMs - riseMs) / (setMs - riseMs);
    sunProgress = Math.max(0, Math.min(1, sunProgress));
    
    sunX = 150 - 130 * Math.cos(Math.PI * sunProgress);
    sunY = 100 - 85 * Math.sin(Math.PI * sunProgress);
  } else {
    // Underworld night arc (sinks below horizon)
    const riseMs = sunTimes.sunrise.getTime();
    const setMs = sunTimes.sunset.getTime();
    const currentMs = currentTime.getTime();
    
    let nightProgress = 0.5;
    if (currentMs >= setMs) {
      // After sunset, before next sunrise
      const nextRiseMs = riseMs + 86400000;
      nightProgress = (currentMs - setMs) / (nextRiseMs - setMs);
    } else {
      // Before sunrise, after yesterday's sunset
      const prevSetMs = setMs - 86400000;
      nightProgress = (currentMs - prevSetMs) / (riseMs - prevSetMs);
    }
    nightProgress = Math.max(0, Math.min(1, nightProgress));
    
    // During the night, progress starts at sunset (West = 280) and ends at sunrise (East = 20)
    sunX = 150 + 130 * Math.cos(Math.PI * nightProgress);
    // Curve downwards below the line Y=100
    sunY = 100 + 15 * Math.sin(Math.PI * nightProgress);
  }

  // Calculate Moon Position on the visual Arc
  // We'll map the Moon's azimuth to progress along the visual arc, and place it exactly on the ellipse
  let moonX = 150;
  let moonY = 100;
  
  let moonProgress = 0.5;
  if (moonAzDeg >= 90 && moonAzDeg <= 270) {
    moonProgress = (moonAzDeg - 90) / 180;
  } else if (moonAzDeg > 270) {
    moonProgress = 1 - (moonAzDeg - 270) / 180;
  } else {
    moonProgress = (moonAzDeg + 90) / 180;
  }
  moonProgress = Math.max(0, Math.min(1, moonProgress));

  if (moonAltDeg > 0) {
    // Above horizon (altitude > 0)
    // Map along the upper visual arc path (ry = 85)
    moonX = 150 - 130 * Math.cos(Math.PI * moonProgress);
    moonY = 100 - 85 * Math.sin(Math.PI * moonProgress);
  } else {
    // Below horizon
    // Map along the lower visual arc path (ry = 15)
    moonX = 150 + 130 * Math.cos(Math.PI * moonProgress);
    moonY = 100 + 15 * Math.sin(Math.PI * moonProgress);
  }

  // Custom Moon Phase SVG Path Generator
  // Radius of moon = 10
  const getMoonPathData = (phase: number) => {
    const r = 10;
    const cx = 0;
    const cy = 0;
    const p = phase % 1;
    const rx = r * Math.abs(1 - 2 * p);
    
    // First arc (outer boundary)
    const sweep1 = p < 0.5 ? 1 : 0;
    
    // Second arc (terminator boundary)
    let sweep2 = 0;
    if (p < 0.25) {
      sweep2 = 0;
    } else if (p < 0.5) {
      sweep2 = 1;
    } else if (p < 0.75) {
      sweep2 = 0;
    } else {
      sweep2 = 1;
    }
    
    return `M ${cx},${cy - r} A ${r},${r} 0 0,${sweep1} ${cx},${cy + r} A ${rx},${r} 0 0,${sweep2} ${cx},${cy - r} Z`;
  };

  function nowIsDaytime(now: Date, rise: Date, set: Date): boolean {
    if (isNaN(rise.getTime()) || isNaN(set.getTime())) return true;
    const nowTime = now.getTime();
    return nowTime >= rise.getTime() && nowTime < set.getTime();
  }

  return (
    <div className={`glass-panel ${styles.container}`}>
      {/* Widget Header & Tab Switcher */}
      <div className={styles.header}>
        <div className={styles.title}>
          {activeTab === 'sun' ? (
            <>
              <Sun size={15} style={{ color: 'var(--accent)' }} className="animate-pulse-slow" />
              <span>{lang === 'bn' ? 'সূর্য ট্র্যাকার' : 'Sun Tracker'}</span>
            </>
          ) : (
            <>
              <Moon size={15} style={{ color: 'var(--accent)' }} className="animate-float" />
              <span>{lang === 'bn' ? 'চন্দ্র ট্র্যাকার' : 'Moon Tracker'}</span>
            </>
          )}
        </div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'sun' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('sun')}
          >
            {lang === 'bn' ? 'সূর্য' : 'Sun'}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'moon' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('moon')}
          >
            {lang === 'bn' ? 'চাঁদ' : 'Moon'}
          </button>
        </div>
      </div>

      {/* Visual Sky Dome */}
      <div
        className={`${styles.skyVisualizer} ${
          activeTab === 'sun'
            ? isDay
              ? styles.skyDay
              : styles.skyNight
            : styles.skyNight
        }`}
      >
        {/* Render stars for night background */}
        {((activeTab === 'sun' && !isDay) || activeTab === 'moon') && <div className={styles.stars} />}

        <svg viewBox="0 0 300 120" className={styles.arcSvg}>
          <defs>
            {/* Sun path gradient */}
            <linearGradient id="sun-path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
            </linearGradient>
            {/* Horizon gradient */}
            <linearGradient id="horizon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--card-border)" stopOpacity="0.1" />
              <stop offset="20%" stopColor="var(--card-border)" stopOpacity="0.8" />
              <stop offset="80%" stopColor="var(--card-border)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--card-border)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Horizon Reference Line */}
          <line x1="10" y1="100" x2="290" y2="100" stroke="url(#horizon-grad)" strokeWidth="1.5" />
          <text x="15" y="112" className={styles.horizonLabel}>E</text>
          <text x="280" y="112" className={styles.horizonLabel}>W</text>

          {activeTab === 'sun' ? (
            <>
              {/* Sun Path Arcs */}
              {/* Day arc (Above horizon) */}
              <path
                d="M 20,100 A 130,85 0 0,1 280,100"
                fill="none"
                stroke="url(#sun-path-grad)"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.8"
              />
              {/* Night arc (Below horizon, dotted & dim) */}
              <path
                d="M 280,100 A 130,15 0 0,1 20,100"
                fill="none"
                stroke="var(--card-border)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.4"
              />

              {/* Sun Icon and Glow */}
              <g transform={`translate(${sunX}, ${sunY})`}>
                <g className={styles.sunGlow}>
                  <circle cx="0" cy="0" r="8" fill="#f59e0b" />
                  <circle cx="0" cy="0" r="11" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.5" />
                  {/* Sun rays details */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <line
                      key={angle}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-13"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      transform={`rotate(${angle})`}
                    />
                  ))}
                </g>
              </g>
            </>
          ) : (
            <>
              {/* Moon Path Arcs */}
              {/* Above horizon */}
              <path
                d="M 20,100 A 130,85 0 0,1 280,100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              {/* Below horizon */}
              <path
                d="M 280,100 A 130,15 0 0,1 20,100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Moon Phase Icon with exact illumination drawing */}
              <g transform={`translate(${moonX}, ${moonY})`}>
                <g className={styles.moonGlow}>
                  {/* Dark part of the moon (base circle) */}
                  <circle cx="0" cy="0" r="10" fill="#334155" opacity="0.8" />
                  {/* Light part of the moon (generated path) */}
                  <path d={getMoonPathData(moonIllum.phase)} fill="#f8fafc" />
                  {/* Faint outer highlight */}
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.3" />
                </g>
              </g>
            </>
          )}
        </svg>
      </div>

      {/* Numerical and Time Parameters */}
      <div className={styles.statsGrid}>
        {activeTab === 'sun' ? (
          <>
            {/* Sunrise */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <ArrowUp size={16} style={{ color: '#f59e0b' }} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{lang === 'bn' ? 'সূর্যোদয়' : 'Sunrise'}</span>
                <span className={styles.statValue}>{formatLocalTime(sunTimes.sunrise)}</span>
              </div>
            </div>

            {/* Sunset */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <ArrowDown size={16} style={{ color: '#f97316' }} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{lang === 'bn' ? 'সূর্যাস্ত' : 'Sunset'}</span>
                <span className={styles.statValue}>{formatLocalTime(sunTimes.sunset)}</span>
              </div>
            </div>

            {/* Position: Elevation/Azimuth */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Compass size={16} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{lang === 'bn' ? 'সূর্যের অবস্থান' : 'Sun Position'}</span>
                <span className={styles.statValue}>
                  {translateNumber(Math.round(sunAltDeg), lang)}° / {getCardinal(sunAzDeg)}
                </span>
              </div>
            </div>

            {/* Daylight Duration */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Clock size={16} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{lang === 'bn' ? 'দিনের দৈর্ঘ্য' : 'Day Length'}</span>
                <span className={styles.statValue}>{getDayLength()}</span>
              </div>
            </div>

            {/* Event Countdown Banner */}
            <div className={styles.statDesc}>
              {getNextEventText()}
            </div>
          </>
        ) : (
          <>
            {/* Moon Phase Name */}
            <div className={styles.statCard} style={{ gridColumn: 'span 2' }}>
              <div className={styles.statIcon}>
                <Eye size={16} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{lang === 'bn' ? 'চাঁদের দশা' : 'Moon Phase'}</span>
                <span className={styles.statValue} style={{ fontSize: '0.8rem' }}>
                  {getMoonPhaseName(moonIllum.phase)}
                </span>
              </div>
            </div>

            {/* Moon Illumination Percentage */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Sun size={16} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{lang === 'bn' ? 'আলোকিত অংশ' : 'Illumination'}</span>
                <span className={styles.statValue}>
                  {translateNumber(Math.round(moonIllum.fraction * 100), lang)}%
                </span>
              </div>
            </div>

            {/* Moon Position: Elevation/Azimuth */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Compass size={16} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{lang === 'bn' ? 'চাঁদের অবস্থান' : 'Moon Position'}</span>
                <span className={styles.statValue}>
                  {translateNumber(Math.round(moonAltDeg), lang)}° / {getCardinal(moonAzDeg)}
                </span>
              </div>
            </div>

            {/* Status explanation */}
            <div className={styles.statDesc}>
              {moonAltDeg > 0
                ? lang === 'bn'
                  ? `চাঁদ দিগন্তের উপরে রয়েছে (দিগংশ ${translateNumber(Math.round(moonAzDeg), lang)}°)`
                  : `Moon is currently visible (azimuth ${Math.round(moonAzDeg)}°)`
                : lang === 'bn'
                ? 'চাঁদ দিগন্তের নিচে অবস্থান করছে'
                : 'Moon is currently below the horizon'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
