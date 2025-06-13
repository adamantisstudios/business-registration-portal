"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import SignaturePad from "@/components/signature-pad"

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [ghanaCardFile, setGhanaCardFile] = useState<File | null>(null)
  const [ghanaCardPreview, setGhanaCardPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const totalSteps = 5

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGhanaCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setGhanaCardFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setGhanaCardPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl)
    setFormData((prev) => ({ ...prev, signature: dataUrl }))
  }

  const validateCurrentStep = () => {
    const currentForm = formRef.current
    if (!currentForm) return false

    const requiredFields = currentForm.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if ((field as HTMLInputElement).value.trim() === "") {
        isValid = false
        ;(field as HTMLInputElement).classList.add("border-red-500")
      } else {
        ;(field as HTMLInputElement).classList.remove("border-red-500")
      }
    })

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
    }

    // Special validation for step 5 (signature)
    if (currentStep === 5 && !signatureDataUrl) {
      toast({
        title: "Signature Required",
        description: "Please provide your signature before submitting.",
        variant: "destructive",
      })
      return false
    }

    return isValid
  }

  const changeStep = (direction: number) => {
    if (direction === 1) {
      if (!validateCurrentStep()) return

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } else {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCurrentStep()) return

    if (!ghanaCardFile) {
      toast({
        title: "Ghana Card Required",
        description: "Please upload your Ghana Card before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!signatureDataUrl) {
      toast({
        title: "Signature Required",
        description: "Please provide your signature before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create form data for submission
      const submitFormData = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submitFormData.append(key, value.toString())
        }
      })

      // Add files
      if (ghanaCardFile) {
        submitFormData.append("ghanaCardFile", ghanaCardFile)
      }

      if (signatureDataUrl) {
        submitFormData.append("signature", signatureDataUrl)
      }

      // Submit the form
      const response = await fetch("/api/register", {
        method: "POST",
        body: submitFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Registration failed")
      }

      toast({
        title: "Registration Successful",
        description: "Your business registration has been submitted successfully!",
      })

      // Redirect to services page
      router.push("/services")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Business Registration Form</CardTitle>
        <CardDescription className="text-center">
          Complete this form to register your business in Ghana. All fields marked with * are required.
        </CardDescription>

        {/* Progress Bar */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                index + 1 === currentStep
                  ? "bg-blue-500 text-white"
                  : index + 1 < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Step 1: Business Information</h2>
              <p className="text-gray-500 italic">Provide basic information about your business</p>

              {/* Section A: Business Name */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    A
                  </span>
                  Business Name
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    Enter the exact name you want to register for your business. This will be the official name on your
                    certificate.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Enter your desired business name (e.g., "ABC Trading Enterprise")
                  </p>
                </div>
              </div>

              {/* Section B: Nature of Business */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    B
                  </span>
                  Nature of Business/Sector(s)
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    Select the primary sector your business operates in. If your business doesn't fit the listed
                    categories, select "Other" and specify.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector *</Label>
                    <Select
                      name="sector"
                      value={formData.sector || ""}
                      onValueChange={(value) => handleSelectChange("sector", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Trading">Trading</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Tourism">Tourism</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.sector === "Other" && (
                    <div className="space-y-2">
                      <Label htmlFor="otherSector">Please specify if others</Label>
                      <Input
                        id="otherSector"
                        name="otherSector"
                        value={formData.otherSector || ""}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-gray-500">Describe your business sector if not listed above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Step 2: Address Information</h2>
              <p className="text-gray-500 italic">Provide your business address details</p>

              {/* Section D: Registered Office Address */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    D
                  </span>
                  Registered Office Address
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    This is the official address where your business is registered. It must be a physical address in
                    Ghana.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="digitalAddress">Digital Address</Label>
                    <Input
                      id="digitalAddress"
                      name="digitalAddress"
                      value={formData.digitalAddress || ""}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500">Ghana Post GPS address (e.g., GA-123-4567)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="houseNumber">House/Building/Flat (Name or House No.)/LMB *</Label>
                    <Input
                      id="houseNumber"
                      name="houseNumber"
                      value={formData.houseNumber || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-gray-500">House number, building name, or P.O. Box</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetName">Street Name *</Label>
                    <Input
                      id="streetName"
                      name="streetName"
                      value={formData.streetName || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city || ""} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select
                      name="region"
                      value={formData.region || ""}
                      onValueChange={(value) => handleSelectChange("region", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                        <SelectItem value="Ashanti">Ashanti</SelectItem>
                        <SelectItem value="Western">Western</SelectItem>
                        <SelectItem value="Eastern">Eastern</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="Volta">Volta</SelectItem>
                        <SelectItem value="Northern">Northern</SelectItem>
                        <SelectItem value="Upper East">Upper East</SelectItem>
                        <SelectItem value="Upper West">Upper West</SelectItem>
                        <SelectItem value="Bono">Bono</SelectItem>
                        <SelectItem value="Bono East">Bono East</SelectItem>
                        <SelectItem value="Ahafo">Ahafo</SelectItem>
                        <SelectItem value="Western North">Western North</SelectItem>
                        <SelectItem value="Savannah">Savannah</SelectItem>
                        <SelectItem value="North East">North East</SelectItem>
                        <SelectItem value="Oti">Oti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="ownershipType">Ownership Type *</Label>
                  <Select
                    name="ownershipType"
                    value={formData.ownershipType || ""}
                    onValueChange={(value) => handleSelectChange("ownershipType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owner">Owner</SelectItem>
                      <SelectItem value="Tenant">Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.ownershipType === "Tenant" && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="landlordName">Landlord's Name *</Label>
                    <Input
                      id="landlordName"
                      name="landlordName"
                      value={formData.landlordName || ""}
                      onChange={handleInputChange}
                      required={formData.ownershipType === "Tenant"}
                    />
                  </div>
                )}
              </div>

              {/* Section E: Principal Place of Business */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    E
                  </span>
                  Principal Place of Business
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    This is where your business primarily operates. If it's the same as your registered address, you can
                    check the box below.
                  </p>
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="sameAddress"
                    checked={formData.sameAddress || false}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({ ...prev, sameAddress: checked }))
                    }}
                  />
                  <label
                    htmlFor="sameAddress"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Same as Registered Office Address
                  </label>
                </div>

                {!formData.sameAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="principalDigitalAddress">Digital Address</Label>
                      <Input
                        id="principalDigitalAddress"
                        name="principalDigitalAddress"
                        value={formData.principalDigitalAddress || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principalHouseNumber">House/Building/Flat (Name or House No.)/LMB</Label>
                      <Input
                        id="principalHouseNumber"
                        name="principalHouseNumber"
                        value={formData.principalHouseNumber || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principalStreetName">Street Name</Label>
                      <Input
                        id="principalStreetName"
                        name="principalStreetName"
                        value={formData.principalStreetName || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principalCity">City</Label>
                      <Input
                        id="principalCity"
                        name="principalCity"
                        value={formData.principalCity || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principalDistrict">District</Label>
                      <Input
                        id="principalDistrict"
                        name="principalDistrict"
                        value={formData.principalDistrict || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principalRegion">Region</Label>
                      <Select
                        name="principalRegion"
                        value={formData.principalRegion || ""}
                        onValueChange={(value) => handleSelectChange("principalRegion", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                          <SelectItem value="Ashanti">Ashanti</SelectItem>
                          <SelectItem value="Western">Western</SelectItem>
                          <SelectItem value="Eastern">Eastern</SelectItem>
                          <SelectItem value="Central">Central</SelectItem>
                          <SelectItem value="Volta">Volta</SelectItem>
                          <SelectItem value="Northern">Northern</SelectItem>
                          <SelectItem value="Upper East">Upper East</SelectItem>
                          <SelectItem value="Upper West">Upper West</SelectItem>
                          <SelectItem value="Bono">Bono</SelectItem>
                          <SelectItem value="Bono East">Bono East</SelectItem>
                          <SelectItem value="Ahafo">Ahafo</SelectItem>
                          <SelectItem value="Western North">Western North</SelectItem>
                          <SelectItem value="Savannah">Savannah</SelectItem>
                          <SelectItem value="North East">North East</SelectItem>
                          <SelectItem value="Oti">Oti</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Section F: Postal Address */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    F
                  </span>
                  Postal Address
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    This is the address where official mail will be sent to your business.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="postalType">Postal Address Type *</Label>
                    <Select
                      name="postalType"
                      value={formData.postalType || ""}
                      onValueChange={(value) => handleSelectChange("postalType", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select postal address type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P.O. Box">P.O. Box</SelectItem>
                        <SelectItem value="PMB">PMB</SelectItem>
                        <SelectItem value="Digital Address">Digital Address</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="postalNumber">Postal Number *</Label>
                      <Input
                        id="postalNumber"
                        name="postalNumber"
                        value={formData.postalNumber || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalTown">Town/City *</Label>
                      <Input
                        id="postalTown"
                        name="postalTown"
                        value={formData.postalTown || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalRegion">Region *</Label>
                      <Select
                        name="postalRegion"
                        value={formData.postalRegion || ""}
                        onValueChange={(value) => handleSelectChange("postalRegion", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                          <SelectItem value="Ashanti">Ashanti</SelectItem>
                          <SelectItem value="Western">Western</SelectItem>
                          <SelectItem value="Eastern">Eastern</SelectItem>
                          <SelectItem value="Central">Central</SelectItem>
                          <SelectItem value="Volta">Volta</SelectItem>
                          <SelectItem value="Northern">Northern</SelectItem>
                          <SelectItem value="Upper East">Upper East</SelectItem>
                          <SelectItem value="Upper West">Upper West</SelectItem>
                          <SelectItem value="Bono">Bono</SelectItem>
                          <SelectItem value="Bono East">Bono East</SelectItem>
                          <SelectItem value="Ahafo">Ahafo</SelectItem>
                          <SelectItem value="Western North">Western North</SelectItem>
                          <SelectItem value="Savannah">Savannah</SelectItem>
                          <SelectItem value="North East">North East</SelectItem>
                          <SelectItem value="Oti">Oti</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Step 3: Contact Information</h2>
              <p className="text-gray-500 italic">Provide contact details for your business</p>

              {/* Section G: Business Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    G
                  </span>
                  Business Contact Information
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    These are the official contact details for your business. At least one phone number is required.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo1">Phone Number 1 *</Label>
                    <Input
                      id="phoneNo1"
                      name="phoneNo1"
                      value={formData.phoneNo1 || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo2">Phone Number 2</Label>
                    <Input id="phoneNo2" name="phoneNo2" value={formData.phoneNo2 || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNo1">Mobile Number 1 *</Label>
                    <Input
                      id="mobileNo1"
                      name="mobileNo1"
                      value={formData.mobileNo1 || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNo2">Mobile Number 2</Label>
                    <Input
                      id="mobileNo2"
                      name="mobileNo2"
                      value={formData.mobileNo2 || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fax">Fax</Label>
                    <Input id="fax" name="fax" value={formData.fax || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Email *</Label>
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      value={formData.businessEmail || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={formData.website || ""} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* Section H: Proprietor Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    H
                  </span>
                  Proprietor Information
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    Provide details about the business owner or primary proprietor.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Select
                      name="title"
                      value={formData.title || ""}
                      onValueChange={(value) => handleSelectChange("title", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Rev.">Rev.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      value={formData.middleName || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formerName">Former Name (if any)</Label>
                    <Input
                      id="formerName"
                      name="formerName"
                      value={formData.formerName || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      name="gender"
                      value={formData.gender || ""}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tin">TIN (if any)</Label>
                    <Input id="tin" name="tin" value={formData.tin || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ghanaCardNumber">Ghana Card Number *</Label>
                    <Input
                      id="ghanaCardNumber"
                      name="ghanaCardNumber"
                      value={formData.ghanaCardNumber || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-gray-500">Format: GHA-XXXXXXXXX-X</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Step 4: Additional Information</h2>
              <p className="text-gray-500 italic">Provide additional details about your business</p>

              {/* Section I: Residential Address */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    I
                  </span>
                  Residential Address
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">Provide the residential address of the business proprietor.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="residentialDigitalAddress">Digital Address</Label>
                    <Input
                      id="residentialDigitalAddress"
                      name="residentialDigitalAddress"
                      value={formData.residentialDigitalAddress || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residentialHouseNumber">House/Building Number *</Label>
                    <Input
                      id="residentialHouseNumber"
                      name="residentialHouseNumber"
                      value={formData.residentialHouseNumber || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residentialStreetName">Street Name *</Label>
                    <Input
                      id="residentialStreetName"
                      name="residentialStreetName"
                      value={formData.residentialStreetName || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residentialCity">City *</Label>
                    <Input
                      id="residentialCity"
                      name="residentialCity"
                      value={formData.residentialCity || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residentialDistrict">District *</Label>
                    <Input
                      id="residentialDistrict"
                      name="residentialDistrict"
                      value={formData.residentialDistrict || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residentialRegion">Region *</Label>
                    <Select
                      name="residentialRegion"
                      value={formData.residentialRegion || ""}
                      onValueChange={(value) => handleSelectChange("residentialRegion", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                        <SelectItem value="Ashanti">Ashanti</SelectItem>
                        <SelectItem value="Western">Western</SelectItem>
                        <SelectItem value="Eastern">Eastern</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="Volta">Volta</SelectItem>
                        <SelectItem value="Northern">Northern</SelectItem>
                        <SelectItem value="Upper East">Upper East</SelectItem>
                        <SelectItem value="Upper West">Upper West</SelectItem>
                        <SelectItem value="Bono">Bono</SelectItem>
                        <SelectItem value="Bono East">Bono East</SelectItem>
                        <SelectItem value="Ahafo">Ahafo</SelectItem>
                        <SelectItem value="Western North">Western North</SelectItem>
                        <SelectItem value="Savannah">Savannah</SelectItem>
                        <SelectItem value="North East">North East</SelectItem>
                        <SelectItem value="Oti">Oti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country || "Ghana"}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section J: Business Details */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    J
                  </span>
                  Business Details
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">Provide additional details about your business operations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Revenue Envisaged (GHS) *</Label>
                    <Select
                      name="revenue"
                      value={formData.revenue || ""}
                      onValueChange={(value) => handleSelectChange("revenue", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than 10,000">Less than 10,000</SelectItem>
                        <SelectItem value="10,000 - 50,000">10,000 - 50,000</SelectItem>
                        <SelectItem value="50,001 - 100,000">50,001 - 100,000</SelectItem>
                        <SelectItem value="100,001 - 500,000">100,001 - 500,000</SelectItem>
                        <SelectItem value="500,001 - 1,000,000">500,001 - 1,000,000</SelectItem>
                        <SelectItem value="Above 1,000,000">Above 1,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of Employees Envisaged *</Label>
                    <Select
                      name="employees"
                      value={formData.employees || ""}
                      onValueChange={(value) => handleSelectChange("employees", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 - 5">1 - 5</SelectItem>
                        <SelectItem value="6 - 10">6 - 10</SelectItem>
                        <SelectItem value="11 - 20">11 - 20</SelectItem>
                        <SelectItem value="21 - 50">21 - 50</SelectItem>
                        <SelectItem value="51 - 100">51 - 100</SelectItem>
                        <SelectItem value="Above 100">Above 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section K: BOP Application */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    K
                  </span>
                  Business Operating Permit (BOP) Application
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">
                    Indicate if you want to apply for a Business Operating Permit.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bopRequest">Do you want to apply for a Business Operating Permit? *</Label>
                    <Select
                      name="bopRequest"
                      value={formData.bopRequest || ""}
                      onValueChange={(value) => handleSelectChange("bopRequest", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.bopRequest === "Yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="bopReference">BOP Reference Number (if any)</Label>
                      <Input
                        id="bopReference"
                        name="bopReference"
                        value={formData.bopReference || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section L: Ghana Card Upload */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    L
                  </span>
                  Ghana Card Upload
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">Upload a clear image of your Ghana Card (front side).</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="ghanaCardFile">Upload Ghana Card Image *</Label>
                  <Input
                    id="ghanaCardFile"
                    name="ghanaCardFile"
                    type="file"
                    accept="image/*"
                    onChange={handleGhanaCardChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, JPEG. Max size: 5MB</p>

                  {ghanaCardPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <div className="relative h-48 w-full max-w-md overflow-hidden rounded-md border">
                        <img
                          src={ghanaCardPreview || "/placeholder.svg"}
                          alt="Ghana Card Preview"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Declaration and Signature */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Step 5: Declaration and Signature</h2>
              <p className="text-gray-500 italic">Complete your application with a declaration and signature</p>

              {/* Section M: Declaration */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    M
                  </span>
                  Declaration
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">Read the declaration carefully before signing.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border rounded-md bg-white">
                    <p className="text-sm">I, the undersigned, do hereby declare that:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>The information provided in this form is true and accurate to the best of my knowledge.</li>
                      <li>
                        I understand that providing false information may result in the rejection of my application or
                        revocation of registration.
                      </li>
                      <li>
                        I agree to comply with all applicable laws and regulations governing business operations in
                        Ghana.
                      </li>
                      <li>
                        I consent to the verification of the information provided in this form by the relevant
                        authorities.
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="applicantName">Name of Applicant *</Label>
                      <Input
                        id="applicantName"
                        name="applicantName"
                        value={formData.applicantName || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="declarationDate">Date *</Label>
                      <Input
                        id="declarationDate"
                        name="declarationDate"
                        type="date"
                        value={formData.declarationDate || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="declaration"
                      checked={formData.declaration || false}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({ ...prev, declaration: checked }))
                      }}
                      required
                    />
                    <label
                      htmlFor="declaration"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the declaration above *
                    </label>
                  </div>
                </div>
              </div>

              {/* Section N: Signature */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">
                    N
                  </span>
                  Signature
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-6">
                  <p className="text-sm text-blue-800">Sign in the box below using your mouse or touch screen.</p>
                </div>

                <div className="space-y-4">
                  <SignaturePad onSave={handleSignatureSave} />

                  {signatureDataUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Your signature:</p>
                      <div className="relative h-32 w-full max-w-md overflow-hidden rounded-md border bg-white">
                        <img
                          src={signatureDataUrl || "/placeholder.svg"}
                          alt="Signature Preview"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => changeStep(-1)}
              disabled={currentStep === 1 || isSubmitting}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button type="button" onClick={() => changeStep(1)} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
