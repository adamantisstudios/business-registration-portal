'use client';

import Image from 'next/image';
import React from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
};

export default function ClientImage({
  src,
  alt,
  className,
  fill,
}: Props) {
  const handleError = () => {
    console.log('Error loading image');
  };

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      onError={handleError}
    />
  );
}
