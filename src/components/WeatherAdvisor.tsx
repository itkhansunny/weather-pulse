'use client';

import React from 'react';
import { CurrentWeather } from '@/services/weatherService';
import { Sparkles, Shirt, Umbrella, Glasses, Info } from 'lucide-react';
import styles from './WeatherAdvisor.module.css';

interface WeatherAdvisorProps {
  current: CurrentWeather;
  lang: string;
}

export default function WeatherAdvisor({ current, lang }: WeatherAdvisorProps) {
  const temp = current.temp;
  const precip = current.cloudCover; // fallback or check if precipitation can be derived or check details
  const uv = current.uvIndex;
  const wind = current.windSpeed * 3.6; // convert to km/h
  const humidity = current.humidity;

  // 1. Get Clothing Recommendation
  const getClothingAdvice = () => {
    if (temp < 5) {
      return {
        text: lang === 'bn' 
          ? 'তীব্র ঠান্ডা! বাইরে বের হওয়ার আগে ভারী জ্যাকেট বা কোট, গ্লাভস এবং কানটুপি পরুন।'
          : 'Freezing cold outside. Wear a heavy winter coat, gloves, thermal layers, and a warm beanie.',
        class: styles.coldTheme
      };
    } else if (temp < 15) {
      return {
        text: lang === 'bn'
          ? 'বেশ ঠান্ডা আবহাওয়া। গরম কাপড় বা সোয়েটার ও মাঝারি জ্যাকেট পরিধান করুন।'
          : 'Chilly weather. Dress in warm layers—a sweater, thick jacket, or cardigan is highly recommended.',
        class: styles.chillyTheme
      };
    } else if (temp < 24) {
      return {
        text: lang === 'bn'
          ? 'আরামদায়ক আবহাওয়া। সাধারণ ফুল হাতা শার্ট, হালকা হুডি বা একটি পাতলা সোয়েটার পরতে পারেন।'
          : 'Mild and pleasant. A light jacket, hoodie, or long-sleeve shirt will keep you perfectly comfortable.',
        class: styles.comfortableTheme
      };
    } else if (temp < 32) {
      return {
        text: lang === 'bn'
          ? 'গরম আবহাওয়া। সারাদিন আরামদায়ক থাকতে হালকা রঙের ও ঢিলেঢালা সুতি পোশাক পরুন।'
          : 'Warm conditions. Opt for light, breathable cotton clothing to stay cool throughout the day.',
        class: styles.warmTheme
      };
    } else {
      return {
        text: lang === 'bn'
          ? 'তীব্র গরম! রোদে যাওয়া এড়িয়ে চলুন, পাতলা সুতি পোশাক পরুন এবং প্রচুর তরল বা পানি পান করুন।'
          : 'Intense heat. Wear loose-fitting, light-colored fabrics. Avoid thick materials and stay hydrated.',
        class: styles.hotTheme
      };
    }
  };

  // 2. Get Outdoor Activity / Safety Recommendation
  const getOutdoorAdvice = () => {
    // Check rain based on weather symbol code containing "rain" or "drizzle" or "shower"
    const symbol = current.symbolCode.toLowerCase();
    const isRaining = symbol.includes('rain') || symbol.includes('drizzle') || symbol.includes('sleet') || symbol.includes('snow');

    if (isRaining) {
      return {
        icon: <Umbrella size={18} className={styles.iconRain} />,
        title: lang === 'bn' ? 'বৃষ্টির সতর্কতা' : 'Rain Alert',
        text: lang === 'bn'
          ? 'বাইরে বৃষ্টিপাত হচ্ছে। একটি ওয়াটারপ্রুফ রেইনকোট বা ছাতা অবশ্যই সাথে রাখুন।'
          : 'It is currently raining. Don\'t forget to carry an umbrella or wear a waterproof raincoat.',
        class: styles.rainAlert
      };
    } else if (uv !== undefined && uv >= 6) {
      return {
        icon: <Glasses size={18} className={styles.iconSun} />,
        title: lang === 'bn' ? 'তীব্র অতিবেগুনি রশ্মি (UV)' : 'High UV Index',
        text: lang === 'bn'
          ? 'তীব্র অতিবেগুনি রশ্মি সচল! বাইরে যাওয়ার আগে সানস্ক্রিন (SPF ৩০+) ব্যবহার করুন এবং সানগ্লাস পরুন।'
          : 'High UV radiation levels. Apply sunscreen (SPF 30+), wear sunglasses, and carry a sun hat.',
        class: styles.uvAlert
      };
    } else if (wind >= 25) {
      return {
        icon: <Info size={18} className={styles.iconWind} />,
        title: lang === 'bn' ? 'ঝড়ো হাওয়া' : 'Windy Conditions',
        text: lang === 'bn'
          ? 'ঝড়ো হাওয়া বইছে। মাথা ঢাকুন, ধুলোবালি থেকে বাঁচতে মাস্ক পরুন এবং বাতাস প্রতিরোধী জ্যাকেট রাখুন।'
          : 'Strong winds detected. Avoid high-altitude activities and wear wind-resistant outer layers.',
        class: styles.windAlert
      };
    } else if (humidity >= 80 && temp >= 25) {
      return {
        icon: <Info size={18} className={styles.iconHumidity} />,
        title: lang === 'bn' ? 'অতিরিক্ত আর্দ্রতা' : 'Sticky Humidity',
        text: lang === 'bn'
          ? 'অতিরিক্ত আর্দ্রতার কারণে ঘাম ও আঠালো ভাব হতে পারে। প্রচুর পানি পান করে আর্দ্র থাকুন।'
          : 'High humidity makes it feel sticky. Drink plenty of water and wear moisture-wicking fabrics.',
        class: styles.humidityAlert
      };
    } else {
      return {
        icon: <Info size={18} className={styles.iconClear} />,
        title: lang === 'bn' ? 'অনুকূল আবহাওয়া' : 'Great Outdoors',
        text: lang === 'bn'
          ? 'বাইরে চমৎকার ও শান্ত আবহাওয়া বিরাজ করছে। হাঁটাচলা, সাইক্লিং বা যেকোনো ঘরের বাইরের কাজের জন্য আদর্শ।'
          : 'Wonderful weather for outdoor activities! A perfect day for a walk in the park or some exercise.',
        class: styles.clearAlert
      };
    }
  };

  const clothing = getClothingAdvice();
  const outdoor = getOutdoorAdvice();

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <Sparkles size={16} className={styles.sparkleIcon} />
        <span className={styles.title}>{lang === 'bn' ? 'স্মার্ট নির্দেশিকা' : 'Weather Advisor'}</span>
      </div>

      <div className={styles.advisorContent}>
        {/* Clothing Card */}
        <div className={`${styles.advisorCard} ${clothing.class}`}>
          <div className={styles.cardHeader}>
            <Shirt size={18} className={styles.shirtIcon} />
            <span className={styles.cardTitle}>{lang === 'bn' ? 'পোশাকের ধরন' : 'What to Wear'}</span>
          </div>
          <p className={styles.adviceText}>{clothing.text}</p>
        </div>

        {/* Outdoor / Safety Card */}
        <div className={`${styles.advisorCard} ${outdoor.class}`}>
          <div className={styles.cardHeader}>
            {outdoor.icon}
            <span className={styles.cardTitle}>{outdoor.title}</span>
          </div>
          <p className={styles.adviceText}>{outdoor.text}</p>
        </div>
      </div>
    </div>
  );
}
