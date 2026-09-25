import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function SafeImage({ src, alt, className, objectPosition = 'center', width, height, priority }: SafeImageProps) {
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} object-${objectPosition}`}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`${className} object-${objectPosition}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
    />
  );
}
