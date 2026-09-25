'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}

export default function SafeImage({ src, alt, className, objectPosition = 'center' }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <div className={`bg-accent-soft/20 ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-${objectPosition}`}
      onError={() => setError(true)}
    />
  );
}
