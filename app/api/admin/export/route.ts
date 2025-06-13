import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      return NextResponse.json({ status: "error", message: "Authentication required" }, { status: 401 })
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""

    // Fetch registrations
    let query = supabase.from("registrations").select("*")

    if (searchTerm) {
      query = query.or(
        `business_name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,ghana_card_number.ilike.%${searchTerm}%,business_email.ilike.%${searchTerm}%`,
      )
    }

    const { data: registrations, error: registrationsError } = await query.order("created_at", { ascending: false })

    if (registrationsError) {
      throw new Error(`Failed to fetch registrations: ${registrationsError.message}`)
    }

    // Create Excel workbook
    const workbook = XLSX.utils.book_new()

    // Format data for Excel
    const formattedData = registrations.map((reg) => ({
      "Registration Date": new Date(reg.created_at).toLocaleDateString(),
      "Business Name": reg.business_name,
      Sector: reg.sector,
      "First Name": reg.first_name,
      "Last Name": reg.last_name,
      Email: reg.business_email,
      Phone: reg.phone_no1,
      "Ghana Card Number": reg.ghana_card_number,
      "Ghana Card URL": reg.ghana_card_url,
      "Signature URL": reg.signature_url,
      City: reg.city,
      Region: reg.region,
      "Revenue Envisaged": reg.revenue,
      "Employees Envisaged": reg.employees,
    }))

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations")

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })

    // Set response headers
    const headers = new Headers()
    headers.set(
      "Content-Disposition",
      `attachment; filename="registrations-${new Date().toISOString().split("T")[0]}.xlsx"`,
    )
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    return new NextResponse(excelBuffer, {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error("Export error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "An error occurred during export",
      },
      { status: 500 },
    )
  }
}
