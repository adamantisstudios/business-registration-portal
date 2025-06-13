"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface SuccessMessageProps {
  onReset: () => void
}

export default function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Registration Successful!</CardTitle>
        <CardDescription>Your business registration has been submitted successfully.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <p className="text-green-800">
            Thank you for registering your business with us. Your application has been received and is being processed.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
          <ol className="list-decimal pl-5 text-blue-800 space-y-1">
            <li>Our team will review your application within 3-5 business days.</li>
            <li>You will receive an email confirmation with your application reference number.</li>
            <li>
              Once approved, you will be notified to complete the payment process for your business registration
              certificate.
            </li>
            <li>After payment, your certificate will be issued and delivered to you.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button variant="outline" onClick={onReset}>
            Register Another Business
          </Button>
          <Button asChild>
            <Link href="/services">Explore Our Services</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
