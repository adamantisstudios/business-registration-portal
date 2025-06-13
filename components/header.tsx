"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            BusinessReg
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-gray-900">
              Services
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/admin/login">
              <Button variant="outline">Admin Login</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link href="/" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="block text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Admin Login
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
