import React from 'react';

interface WeatherIconProps {
  symbolCode: string;
  size?: number;
  className?: string;
}

export default function WeatherIcon({ symbolCode, size = 48, className = '' }: WeatherIconProps) {
  // met.no provides official SVG icons for all symbol codes in their repository:
  // https://github.com/metno/weathericons
  // We use the jsDelivr CDN to serve these SVGs with edge-cached performance.
  const iconUrl = `https://cdn.jsdelivr.net/gh/metno/weathericons@main/weather/svg/${symbolCode}.svg`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt={symbolCode}
        crossOrigin="anonymous"
        width={size}
        height={size}
        style={{
          objectFit: 'contain',
          width: '135%',
          height: '135%',
          transform: 'scale(1.35)',
          filter: symbolCode.includes('clear') || symbolCode.includes('fair')
            ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))'
            : 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.12))',
        }}
      />
    </div>
  );
}
