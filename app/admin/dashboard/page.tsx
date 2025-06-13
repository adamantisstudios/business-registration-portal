"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminHeader from "@/components/admin/admin-header"
import RegistrationsTable from "@/components/admin/registrations-table"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        toast({
          title: "Authentication required",
          description: "Please login to access the admin dashboard",
          variant: "destructive",
        })
        router.push("/admin/login")
      } else {
        setLoading(false)
      }
    }

    checkSession()
  }, [router, supabase, toast])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="registrations" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <RegistrationsTable searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
              <p className="text-gray-500">Analytics features coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
              <p className="text-gray-500">Settings features coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
