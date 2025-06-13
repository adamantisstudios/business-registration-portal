"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ClientImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export default function ClientImage({ src, alt, fallbackSrc = "/placeholder.png", ...props }: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc || "/placeholder.png"}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
