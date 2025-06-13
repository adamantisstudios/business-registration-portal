"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const phoneNumber = "+233123456789" // Replace with your actual WhatsApp number

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get("message") as string

    if (message.trim()) {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
      setIsOpen(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 w-80 mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-green-600">WhatsApp Chat</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              name="message"
              className="w-full border border-gray-300 rounded p-2 mb-2 h-24 resize-none"
              placeholder="Type your message here..."
              required
            ></textarea>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Send Message
            </Button>
          </form>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full h-14 w-14 flex items-center justify-center bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  )
}
