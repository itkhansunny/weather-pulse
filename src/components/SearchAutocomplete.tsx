'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { searchCities, CityResult } from '@/services/geoService';
import styles from './SearchAutocomplete.module.css';

interface SearchAutocompleteProps {
  onSelectCity: (city: CityResult) => void;
  lang: string;
}

export default function SearchAutocomplete({ onSelectCity, lang }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Helper to convert country code to flag emoji
  const getFlagEmoji = (countryCode?: string) => {
    if (!countryCode) return '📍';
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return '📍';
    }
  };

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchCities(query);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        console.error('Error fetching cities:', err);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        selectCity(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectCity = (city: CityResult) => {
    onSelectCity(city);
    setQuery(`${city.name}, ${city.country}`);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={styles.searchWrapper} onKeyDown={handleKeyDown}>
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.input}
          placeholder={lang === 'bn' ? 'শহরের নাম লিখুন...' : 'Search for a city...'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        <div className={styles.searchIcon}>
          {loading ? (
            <Loader2 size={20} className="animate-spin-slow" style={{ animationDuration: '1.5s' }} />
          ) : (
            <Search size={20} />
          )}
        </div>
        {query && (
          <button onClick={handleClear} className={styles.clearButton} aria-label="Clear input">
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className={styles.dropdown}>
          {results.map((city, idx) => (
            <li
              key={city.id}
              className={`${styles.dropdownItem} ${idx === activeIndex ? styles.activeItem : ''}`}
              onClick={() => selectCity(city)}
            >
              <div>
                <span className={styles.cityName}>{city.name}</span>
                {city.admin1 && <span className={styles.adminName}>({city.admin1})</span>}
              </div>
              <div className={styles.countryContainer}>
                <span className={styles.countryFlag}>{getFlagEmoji(city.country_code)}</span>
                <span className={styles.countryName}>{city.country}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
