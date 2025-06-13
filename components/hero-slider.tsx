"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ClientImage from "./client-image"

const slides = [
  {
    image: "/placeholder.png?height=400&width=1200",
    title: "Register Your Business Today",
    description: "Fast, reliable business registration services in Ghana",
  },
  {
    image: "/placeholder.png?height=400&width=1200",
    title: "Stay Compliant",
    description: "Complete compliance solutions for your business",
  },
  {
    image: "/placeholder.png?height=400&width=1200",
    title: "Professional Support",
    description: "Expert guidance throughout your business journey",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const changeSlide = (direction: number) => {
    setCurrentSlide((prev) => {
      const newIndex = prev + direction
      if (newIndex < 0) return slides.length - 1
      if (newIndex >= slides.length) return 0
      return newIndex
    })
  }

  return (
    <section className="relative h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <ClientImage
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              fallbackSrc="/placeholder.png?height=400&width=1200"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white bg-black/50 p-8 rounded-lg max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}

      <button
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 rounded-full transition-colors"
        onClick={() => changeSlide(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 rounded-full transition-colors"
        onClick={() => changeSlide(1)}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
    </section>
  )
}
