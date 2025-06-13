"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SuccessMessage() {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Check if user was redirected from form submission
    const params = new URLSearchParams(window.location.search)
    const success = params.get("success")

    if (success === "true") {
      setShowMessage(true)

      // Remove query parameter from URL without refreshing the page
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [])

  if (!showMessage) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-green-500 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <div>
              <CardTitle className="text-green-800">Registration Successful!</CardTitle>
              <CardDescription className="text-green-700">
                Your business registration has been submitted successfully.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-4">
            Thank you for registering your business with us. Your application is now being processed. You will receive a
            confirmation email shortly with further instructions.
          </p>
          <p className="text-green-700 mb-6">
            While you wait, explore our additional business services below that can help your new business succeed.
          </p>
          <Button onClick={() => setShowMessage(false)} className="bg-green-600 hover:bg-green-700">
            Explore Services
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
