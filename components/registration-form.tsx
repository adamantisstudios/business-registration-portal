"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import SignaturePad from "./signature-pad"
import SuccessMessage from "./success-message"

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  businessType: z.string().min(1, { message: "Please select a business type." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  description: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, { message: "You must agree to the terms and conditions." }),
  registrationType: z.string().min(1, { message: "Please select a registration type." }),
})

type FormValues = z.infer<typeof formSchema>

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      agreeTerms: false,
      registrationType: "new",
    },
  })

  const onSubmit = async (data: FormValues) => {
    if (!signatureData) {
      toast.error("Please provide your signature")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          signature: signatureData,
        }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      setIsSuccess(true)
      form.reset()
      setSignatureData(null)
    } catch (error) {
      toast.error("Failed to submit registration. Please try again.")
      console.error("Registration error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return <SuccessMessage onReset={() => setIsSuccess(false)} />
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Business Registration</CardTitle>
        <CardDescription>Register your business with our streamlined process</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new" onClick={() => form.setValue("registrationType", "new")}>
                New Registration
              </TabsTrigger>
              <TabsTrigger value="renewal" onClick={() => form.setValue("registrationType", "renewal")}>
                Renewal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" {...form.register("businessName")} placeholder="Enter your business name" />
                  {form.formState.errors.businessName && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("businessType", value)}
                    defaultValue={form.getValues("businessType")}
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="limited_liability">Limited Liability Company</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.businessType && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessType.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...form.register("email")} placeholder="your@email.com" />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" {...form.register("phone")} placeholder="Enter your phone number" />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address *</Label>
                <Input id="address" {...form.register("address")} placeholder="Enter your business address" />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Briefly describe your business activities"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="renewal" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" {...form.register("businessName")} placeholder="Enter your business name" />
                  {form.formState.errors.businessName && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input id="registrationNumber" placeholder="Enter your registration number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...form.register("email")} placeholder="your@email.com" />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" {...form.register("phone")} placeholder="Enter your phone number" />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Signature *</Label>
            <SignaturePad onSave={setSignatureData} />
            {!signatureData && form.formState.isSubmitted && (
              <p className="text-sm text-red-500">Signature is required</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeTerms"
              checked={form.getValues("agreeTerms")}
              onCheckedChange={(checked) => form.setValue("agreeTerms", checked === true)}
            />
            <Label htmlFor="agreeTerms" className="text-sm">
              I agree to the terms and conditions *
            </Label>
          </div>
          {form.formState.errors.agreeTerms && (
            <p className="text-sm text-red-500">{form.formState.errors.agreeTerms.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-500">Need help? Contact our support team at support@businessregistration.com</p>
      </CardFooter>
    </Card>
  )
}
