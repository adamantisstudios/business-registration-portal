import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const supabase = createRouteHandlerClient({ cookies })

    // Extract form fields
    const businessName = formData.get("businessName") as string
    const sector = formData.get("sector") as string
    const otherSector = formData.get("otherSector") as string
    const digitalAddress = formData.get("digitalAddress") as string
    const houseNumber = formData.get("houseNumber") as string
    const streetName = formData.get("streetName") as string
    const city = formData.get("city") as string
    const district = formData.get("district") as string
    const region = formData.get("region") as string
    const ownershipType = formData.get("ownershipType") as string
    const landlordName = formData.get("landlordName") as string
    const sameAddress = formData.get("sameAddress") === "true"
    const principalDigitalAddress = formData.get("principalDigitalAddress") as string
    const principalHouseNumber = formData.get("principalHouseNumber") as string
    const principalStreetName = formData.get("principalStreetName") as string
    const principalCity = formData.get("principalCity") as string
    const principalDistrict = formData.get("principalDistrict") as string
    const principalRegion = formData.get("principalRegion") as string
    const postalType = formData.get("postalType") as string
    const postalNumber = formData.get("postalNumber") as string
    const postalTown = formData.get("postalTown") as string
    const postalRegion = formData.get("postalRegion") as string
    const phoneNo1 = formData.get("phoneNo1") as string
    const phoneNo2 = formData.get("phoneNo2") as string
    const mobileNo1 = formData.get("mobileNo1") as string
    const mobileNo2 = formData.get("mobileNo2") as string
    const fax = formData.get("fax") as string
    const businessEmail = formData.get("businessEmail") as string
    const website = formData.get("website") as string
    const title = formData.get("title") as string
    const firstName = formData.get("firstName") as string
    const middleName = formData.get("middleName") as string
    const lastName = formData.get("lastName") as string
    const formerName = formData.get("formerName") as string
    const gender = formData.get("gender") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const nationality = formData.get("nationality") as string
    const occupation = formData.get("occupation") as string
    const tin = formData.get("tin") as string
    const ghanaCardNumber = formData.get("ghanaCardNumber") as string
    const residentialDigitalAddress = formData.get("residentialDigitalAddress") as string
    const residentialHouseNumber = formData.get("residentialHouseNumber") as string
    const residentialStreetName = formData.get("residentialStreetName") as string
    const residentialCity = formData.get("residentialCity") as string
    const residentialDistrict = formData.get("residentialDistrict") as string
    const residentialRegion = formData.get("residentialRegion") as string
    const country = formData.get("country") as string
    const revenue = formData.get("revenue") as string
    const employees = formData.get("employees") as string
    const bopRequest = formData.get("bopRequest") as string
    const bopReference = formData.get("bopReference") as string
    const applicantName = formData.get("applicantName") as string
    const declarationDate = formData.get("declarationDate") as string
    const declaration = formData.get("declaration") === "true"

    // Get files
    const ghanaCardFile = formData.get("ghanaCardFile") as File
    const signatureDataUrl = formData.get("signature") as string

    // Process Ghana Card file
    let ghanaCardUrl = ""
    if (ghanaCardFile && ghanaCardFile.size > 0) {
      try {
        const ghanaCardBuffer = Buffer.from(await ghanaCardFile.arrayBuffer())
        const ghanaCardFileName = `${Date.now()}-${ghanaCardFile.name.replace(/\s+/g, "-")}`

        const { data: ghanaCardData, error: ghanaCardError } = await supabase.storage
          .from("registration-documents")
          .upload(`ghana-cards/${ghanaCardFileName}`, ghanaCardBuffer, {
            contentType: ghanaCardFile.type,
            cacheControl: "3600",
          })

        if (ghanaCardError) {
          console.error("Ghana Card upload error:", ghanaCardError)
          throw new Error(`Failed to upload Ghana Card: ${ghanaCardError.message}`)
        }

        // Get public URL
        const { data: ghanaCardPublicUrl } = supabase.storage
          .from("registration-documents")
          .getPublicUrl(`ghana-cards/${ghanaCardFileName}`)

        ghanaCardUrl = ghanaCardPublicUrl.publicUrl
      } catch (error) {
        console.error("Ghana Card processing error:", error)
      }
    }

    // Process signature
    let signatureUrl = ""
    if (signatureDataUrl) {
      try {
        // Convert data URL to buffer
        const base64Data = signatureDataUrl.replace(/^data:image\/\w+;base64,/, "")
        const signatureBuffer = Buffer.from(base64Data, "base64")
        const signatureFileName = `${Date.now()}-signature-${lastName}-${firstName}.png`

        const { data: signatureData, error: signatureError } = await supabase.storage
          .from("registration-documents")
          .upload(`signatures/${signatureFileName}`, signatureBuffer, {
            contentType: "image/png",
            cacheControl: "3600",
          })

        if (signatureError) {
          console.error("Signature upload error:", signatureError)
          throw new Error(`Failed to upload signature: ${signatureError.message}`)
        }

        // Get public URL
        const { data: signaturePublicUrl } = supabase.storage
          .from("registration-documents")
          .getPublicUrl(`signatures/${signatureFileName}`)

        signatureUrl = signaturePublicUrl.publicUrl
      } catch (error) {
        console.error("Signature processing error:", error)
      }
    }

    // Save registration data to database
    const { data: registrationData, error: registrationError } = await supabase
      .from("registrations")
      .insert({
        business_name: businessName,
        sector,
        other_sector: otherSector,
        digital_address: digitalAddress,
        house_number: houseNumber,
        street_name: streetName,
        city,
        district,
        region,
        ownership_type: ownershipType,
        landlord_name: landlordName,
        same_address: sameAddress,
        principal_digital_address: principalDigitalAddress,
        principal_house_number: principalHouseNumber,
        principal_street_name: principalStreetName,
        principal_city: principalCity,
        principal_district: principalDistrict,
        principal_region: principalRegion,
        postal_type: postalType,
        postal_number: postalNumber,
        postal_town: postalTown,
        postal_region: postalRegion,
        phone_no1: phoneNo1,
        phone_no2: phoneNo2,
        mobile_no1: mobileNo1,
        mobile_no2: mobileNo2,
        fax,
        business_email: businessEmail,
        website,
        title,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        former_name: formerName,
        gender,
        date_of_birth: dateOfBirth,
        nationality,
        occupation,
        tin,
        ghana_card_number: ghanaCardNumber,
        ghana_card_url: ghanaCardUrl,
        residential_digital_address: residentialDigitalAddress,
        residential_house_number: residentialHouseNumber,
        residential_street_name: residentialStreetName,
        residential_city: residentialCity,
        residential_district: residentialDistrict,
        residential_region: residentialRegion,
        country,
        revenue,
        employees,
        bop_request: bopRequest,
        bop_reference: bopReference,
        applicant_name: applicantName,
        signature_url: signatureUrl,
        declaration_date: declarationDate,
        declaration,
      })
      .select()

    if (registrationError) {
      console.error("Registration error:", registrationError)
      throw new Error(`Failed to save registration: ${registrationError.message}`)
    }

    return NextResponse.json({
      status: "success",
      message: "Registration submitted successfully",
      data: registrationData[0],
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "An error occurred during registration",
      },
      { status: 500 },
    )
  }
}
