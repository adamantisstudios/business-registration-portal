"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Download, Eye, Loader2, Search } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Registration {
  id: string
  created_at: string
  business_name: string
  sector: string
  first_name: string
  last_name: string
  email: string
  phone_no1: string
  ghana_card_number: string
  [key: string]: any
}

interface RegistrationsTableProps {
  searchTerm: string
}

export default function RegistrationsTable({ searchTerm }: RegistrationsTableProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchRegistrations()
  }, [searchTerm])

  const fetchRegistrations = async () => {
    setLoading(true)

    try {
      let query = supabase.from("registrations").select("*")

      if (searchTerm) {
        query = query.or(
          `business_name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,ghana_card_number.ilike.%${searchTerm}%,business_email.ilike.%${searchTerm}%`,
        )
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error

      setRegistrations(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch registrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)

    try {
      const response = await fetch(`/api/admin/export${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Export failed")
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition")
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(contentDisposition || "")
      let filename = "registrations.xlsx"
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, "")
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast({
        title: "Export successful",
        description: "Registrations have been exported to Excel",
      })
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export registrations",
        variant: "destructive",
      })
    } finally {
      setExportLoading(false)
    }
  }

  const viewRegistration = (id: string) => {
    router.push(`/admin/dashboard/${id}`)
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Business Registrations</h2>
          <Button
            onClick={handleExport}
            disabled={exportLoading || registrations.length === 0}
            className="flex items-center gap-2"
          >
            {exportLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export to Excel
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg">Loading registrations...</span>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No registrations found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No results match "${searchTerm}". Try a different search term.`
                : "No business registrations have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Proprietor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Ghana Card</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">{formatDate(registration.created_at)}</TableCell>
                    <TableCell>{registration.business_name}</TableCell>
                    <TableCell>{registration.sector}</TableCell>
                    <TableCell>
                      {registration.first_name} {registration.last_name}
                    </TableCell>
                    <TableCell>{registration.phone_no1}</TableCell>
                    <TableCell>{registration.ghana_card_number}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewRegistration(registration.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  )
}
