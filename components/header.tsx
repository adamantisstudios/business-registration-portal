import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <Image src="/assets/logo.png" alt="BizCompliance Hub" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold">BizCompliance Hub</h1>
            <p className="text-sm opacity-80">by Adamantis Studios</p>
          </div>
        </div>
        <nav className="flex gap-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            Home
          </Link>
          <Link href="/services" className="hover:opacity-80 transition-opacity">
            Services
          </Link>
          <a href="#contact" className="hover:opacity-80 transition-opacity">
            Contact
          </a>
        </nav>
      </div>
    </header>
  )
}
