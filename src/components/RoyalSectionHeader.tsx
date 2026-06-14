import React from 'react';

interface RoyalSectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  onDark?: boolean;
  className?: string;
}

export default function RoyalSectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  onDark = false,
  className = '',
}: RoyalSectionHeaderProps) {
  return (
    <div
      className={`ab-store-heading ${align === 'left' ? 'ab-store-heading--left' : ''} ${onDark ? 'ab-store-heading--on-dark' : ''} ${className}`}
    >
      {badge && <span className="ab-store-badge">{badge}</span>}
      <h2 className="ab-store-title">{title}</h2>
      {subtitle && <p className="ab-store-subtitle">{subtitle}</p>}
    </div>
  );
}
