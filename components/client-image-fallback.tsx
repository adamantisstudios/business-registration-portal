"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ImageFallbackProps extends Omit<ImageProps, "src" | "onError"> {
  src: string
  fallbackSrc: string
}

export default function ClientImageFallback({ src, fallbackSrc, alt, ...rest }: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...rest}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
