'use client';

import Image from 'next/image';

type ClientImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

const ClientImage = ({ src, alt, width = 400, height = 300, className = '' }: ClientImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};

export default ClientImage;
