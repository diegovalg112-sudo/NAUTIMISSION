import React from 'react';
import filomatasOfficialLogo from '../assets/filomatas-lab-official-logo.png';

interface FilomatasLogoProps {
  className?: string;
  alt?: string;
}

/**
 * Official Filómatas LAB organization logo component.
 * Renders the definitive transparent PNG asset directly with strict
 * aspect-ratio, color, and transparency preservation (no wrapper box).
 */
export const FilomatasLogo: React.FC<FilomatasLogoProps> = ({
  className = 'h-8 sm:h-9',
  alt = 'Filómatas LAB — Passion for discovery',
}) => {
  return (
    <img
      src={filomatasOfficialLogo}
      alt={alt}
      width={2064}
      height={762}
      className={`aspect-[2064/762] w-auto max-w-full flex-none object-contain select-none ${className}`}
      draggable={false}
    />
  );
};
