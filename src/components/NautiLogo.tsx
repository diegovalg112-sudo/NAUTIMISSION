import React from 'react';
import nautiOfficialLogo from '../assets/nauti-official-logo.png';

interface NautiLogoProps {
  className?: string;
  alt?: string;
}

/**
 * Official NAUTI platform logo component.
 * Uses the supplied high-resolution transparent PNG artwork verbatim
 * with strict aspect-ratio and color preservation.
 */
export const NautiLogo: React.FC<NautiLogoProps> = ({
  className = 'h-10 sm:h-12',
  alt = 'NAUTI',
}) => {
  return (
    <img
      src={nautiOfficialLogo}
      alt={alt}
      width={2164}
      height={727}
      className={`aspect-[2164/727] w-auto max-w-full flex-none object-contain select-none ${className}`}
      draggable={false}
    />
  );
};
