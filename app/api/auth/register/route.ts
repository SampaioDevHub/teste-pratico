import { NextResponse } from "next/server"
import { tempStore } from "@/lib/temp-store"

const VALID_LAWYER_CODES = ["LAW123", "LAW456", "LAW789", "ADM123"]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, lawyerCode } = body

    // Basic validation
    if (!name || !email || !password || !lawyerCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if lawyer code is valid
    if (!VALID_LAWYER_CODES.includes(lawyerCode)) {
      return NextResponse.json({ error: "Invalid lawyer code" }, { status: 400 })
    }

    // Check if email already exists
    if (tempStore.users.some((user) => user.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: (tempStore.users.length + 1).toString(),
      name,
      email,
      role: lawyerCode === "ADM123" ? "ADMIN" : "USER",
      lawyerCode,
      createdAt: new Date(),
    }

    tempStore.users.push(newUser)

    // Don't send the password back
    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

