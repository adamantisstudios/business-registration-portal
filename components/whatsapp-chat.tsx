"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, X } from "lucide-react"

const quickMessages = [
  {
    id: "registration",
    icon: "file-text",
    text: "Ask about registration status",
    message:
      "Hi! I recently submitted my business registration form and would like to check on the status of my application. Can you please provide an update?",
  },
  {
    id: "services",
    icon: "briefcase",
    text: "Inquire about services",
    message:
      "Hello! I am interested in learning more about your business services. Can you provide me with detailed information about what you offer?",
  },
  {
    id: "pricing",
    icon: "dollar-sign",
    text: "Get pricing information",
    message:
      "Hi! I would like to get detailed pricing information for your services. Can you send me a comprehensive price list?",
  },
  {
    id: "support",
    icon: "headset",
    text: "Technical support",
    message: "Hello! I need technical support with your services. Can someone assist me with my questions?",
  },
  {
    id: "consultation",
    icon: "calendar",
    text: "Book consultation",
    message:
      "Hi! I would like to book a consultation to discuss my business needs. What are your available time slots?",
  },
]

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const sendQuickMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/233242799990?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  const sendCustomMessage = () => {
    if (!customMessage.trim()) return

    const encodedMessage = encodeURIComponent(customMessage)
    const whatsappUrl = `https://wa.me/233242799990?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setCustomMessage("")
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={toggleChat}
        className={`rounded-full p-4 shadow-lg ${
          isOpen ? "bg-green-700 hover:bg-green-800" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        <span className="sr-only">Chat with us</span>
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 left-0 w-80 shadow-xl">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-lg">Chat with us</CardTitle>
            <CardDescription className="text-green-100">Select a quick message or type your own</CardDescription>
          </CardHeader>
          <CardContent className="p-3 space-y-2 max-h-80 overflow-y-auto">
            {quickMessages.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => sendQuickMessage(item.message)}
              >
                {item.text}
              </Button>
            ))}
            <div className="pt-2">
              <Textarea
                placeholder="Type your message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t p-3">
            <Button
              onClick={sendCustomMessage}
              disabled={!customMessage.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
