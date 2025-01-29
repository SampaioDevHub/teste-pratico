/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { tempStore } from "@/lib/temp-store";

const TEMP_PASSWORDS = {
  "admin@example.com": "admin123", 
};

const ERRORS = {
  MISSING_CREDENTIALS: { error: "Missing email or password", status: 400 },
  INVALID_CREDENTIALS: { error: "Invalid credentials", status: 401 },
  SERVER_ERROR: { error: "Internal server error", status: 500 },
};

const validateRequestBody = (body: any) => {
  const { email, password } = body;
  if (!email || !password) {
    throw new Error("MISSING_CREDENTIALS");
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validateRequestBody(body);

    const { email, password } = body;

    // Find user
    const user = tempStore.users.find((u) => u.email === email);

    // Check if user exists and password matches
    if (!user || TEMP_PASSWORDS[email] !== password) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Return user without sensitive information
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Login error:", error.message || error);

    const responseError = ERRORS[error.message] || ERRORS.SERVER_ERROR;
    return NextResponse.json(responseError, { status: responseError.status });
  }
}
