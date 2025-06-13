"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import Image from "next/image"
import AdminHeader from "@/components/admin/admin-header"
import { formatDate } from "@/lib/utils"

type Registration = {
  id: string
  created_at: string
  business_name: string
  sector: string
  first_name: string
  last_name: string
  email: string
  phone: string
  ghana_card_number: string
  ghana_card_url: string
  signature_url: string
  [key: string]: any
}

export default function RegistrationDetails({ params }: { params: { id: string } }) {
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const { id } = params

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        })
        router.push("/admin/login")
        return
      }

      // Fetch registration data
      try {
        const { data, error } = await supabase.from("registrations").select("*").eq("id", id).single()

        if (error) throw error
        if (!data) throw new Error("Registration not found")

        setRegistration(data)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch registration details",
          variant: "destructive",
        })
        router.push("/admin/dashboard")
      } finally {
        setLoading(false)
      }
    }

    checkSessionAndFetchData()
  }, [id, router, supabase, toast])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download started",
        description: `${filename} is being downloaded`,
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Loading registration details...</p>
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl">Registration not found</p>
        <Button onClick={() => router.push("/admin/dashboard")} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Registration Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="business" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="proprietor">Proprietor</TabsTrigger>
                    <TabsTrigger value="additional">Additional</TabsTrigger>
                  </TabsList>

                  <TabsContent value="business">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                        <dd className="mt-1 text-lg">{registration.business_name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Sector</dt>
                        <dd className="mt-1 text-lg">{registration.sector}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                        <dd className="mt-1 text-lg">{formatDate(registration.created_at)}</dd>
                      </div>
                      {registration.other_sector && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Other Sector</dt>
                          <dd className="mt-1 text-lg">{registration.other_sector}</dd>
                        </div>
                      )}
                    </dl>
                  </TabsContent>

                  <TabsContent value="address">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Digital Address</dt>
                        <dd className="mt-1 text-lg">{registration.digital_address || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">House/Building Number</dt>
                        <dd className="mt-1 text-lg">{registration.house_number || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Street Name</dt>
                        <dd className="mt-1 text-lg">{registration.street_name || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">City</dt>
                        <dd className="mt-1 text-lg">{registration.city || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">District</dt>
                        <dd className="mt-1 text-lg">{registration.district || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Region</dt>
                        <dd className="mt-1 text-lg">{registration.region || "N/A"}</dd>
                      </div>
                    </dl>
                  </TabsContent>

                  <TabsContent value="contact">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone Number 1</dt>
                        <dd className="mt-1 text-lg">{registration.phone_no1 || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone Number 2</dt>
                        <dd className="mt-1 text-lg">{registration.phone_no2 || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mobile Number 1</dt>
                        <dd className="mt-1 text-lg">{registration.mobile_no1 || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mobile Number 2</dt>
                        <dd className="mt-1 text-lg">{registration.mobile_no2 || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-lg">{registration.business_email || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Website</dt>
                        <dd className="mt-1 text-lg">{registration.website || "N/A"}</dd>
                      </div>
                    </dl>
                  </TabsContent>

                  <TabsContent value="proprietor">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Title</dt>
                        <dd className="mt-1 text-lg">{registration.title || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">First Name</dt>
                        <dd className="mt-1 text-lg">{registration.first_name || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Middle Name</dt>
                        <dd className="mt-1 text-lg">{registration.middle_name || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                        <dd className="mt-1 text-lg">{registration.last_name || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Gender</dt>
                        <dd className="mt-1 text-lg">{registration.gender || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                        <dd className="mt-1 text-lg">
                          {registration.date_of_birth ? formatDate(registration.date_of_birth) : "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                        <dd className="mt-1 text-lg">{registration.nationality || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Ghana Card Number</dt>
                        <dd className="mt-1 text-lg">{registration.ghana_card_number || "N/A"}</dd>
                      </div>
                    </dl>
                  </TabsContent>

                  <TabsContent value="additional">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Revenue Envisaged</dt>
                        <dd className="mt-1 text-lg">{registration.revenue || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Number of Employees</dt>
                        <dd className="mt-1 text-lg">{registration.employees || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">BOP Application</dt>
                        <dd className="mt-1 text-lg">{registration.bop_request || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">BOP Reference</dt>
                        <dd className="mt-1 text-lg">{registration.bop_reference || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Declaration Date</dt>
                        <dd className="mt-1 text-lg">
                          {registration.declaration_date ? formatDate(registration.declaration_date) : "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ghana Card</CardTitle>
              </CardHeader>
              <CardContent>
                {registration.ghana_card_url ? (
                  <div className="space-y-4">
                    <div className="relative h-48 w-full overflow-hidden rounded-md border">
                      <Image
                        src={registration.ghana_card_url || "/placeholder.svg"}
                        alt="Ghana Card"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() =>
                        downloadImage(
                          registration.ghana_card_url,
                          `ghana-card-${registration.last_name}-${registration.first_name}.jpg`,
                        )
                      }
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Ghana Card
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500">No Ghana Card image available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signature</CardTitle>
              </CardHeader>
              <CardContent>
                {registration.signature_url ? (
                  <div className="space-y-4">
                    <div className="relative h-32 w-full overflow-hidden rounded-md border bg-white">
                      <Image
                        src={registration.signature_url || "/placeholder.svg"}
                        alt="Signature"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() =>
                        downloadImage(
                          registration.signature_url,
                          `signature-${registration.last_name}-${registration.first_name}.png`,
                        )
                      }
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Signature
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500">No signature image available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
