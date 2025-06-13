'use client'

import Image from 'next/image'

export default function ClientImage(props) {
  return (
    <Image
      {...props}
      onError={(e) => {
        console.error('Image failed to load')
      }}
    />
  )
}
