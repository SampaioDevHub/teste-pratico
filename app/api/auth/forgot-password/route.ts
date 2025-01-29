/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import { tempStore } from "@/lib/temp-store"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Check if user exists
    const user = tempStore.users.find((u) => u.email === email)

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to the database with an expiration
    // 3. Send an email with the reset link

    // For demo purposes, we'll just return success
    // regardless of whether the email exists
    return NextResponse.json({ message: "Se o e-mail existir, um link de redefinição será enviado." }, { status: 200 })
  } catch (error) {
    console.error("Erro de senha esquecida:", error)
    return NextResponse.json({ error: "Erro do Servidor Interno" }, { status: 500 })
  }
}

