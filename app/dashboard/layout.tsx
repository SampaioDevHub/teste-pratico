"use client"

import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen">
        <DashboardNav />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}

