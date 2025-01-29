import { NextResponse } from "next/server"
import { tempStore } from "@/lib/temp-store"

export async function GET() {
  try {
    // In a real application, you would verify the JWT token here
    // For now, we'll just return the admin user for testing
    const adminUser = tempStore.users.find((user) => user.email === "admin@example.com")

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ user: adminUser })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

