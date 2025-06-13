"use client"

import { useState } from "react"
import Image from "next/image"

type ClientImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

const ClientImage = ({ src, alt, width = 400, height = 300, className = "" }: ClientImageProps) => {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc || "/placeholder.png"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        setImgSrc("/placeholder.png")
      }}
      priority
    />
  )
}

export default ClientImage
