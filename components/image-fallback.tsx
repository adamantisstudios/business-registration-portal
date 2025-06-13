"use client"

import { useState } from "react"
import Image from "next/image"

interface ImageFallbackProps {
  src: string
  fallbackSrc: string
  alt: string
  [key: string]: any
}

export default function ImageFallback({ src, fallbackSrc, alt, ...props }: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
