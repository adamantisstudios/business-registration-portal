"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  onReset: () => void
}

export default function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Registration Successful!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Your business registration has been submitted successfully. We will review your application and contact you
          shortly.
        </p>
        <p className="font-medium">A confirmation email has been sent to your email address.</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onReset}>Register Another Business</Button>
      </CardFooter>
    </Card>
  )
}
