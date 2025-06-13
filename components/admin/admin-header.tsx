"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
            <Image src="/assets/logo.png" alt="BizCompliance Hub" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Portal</h1>
            <p className="text-xs text-gray-500">BizCompliance Hub</p>
          </div>
        </Link>

        <Button variant="ghost" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
