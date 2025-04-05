import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { loginSchema } from "@/schemas/user.schema";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { email, password } = validation.data;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }

  // Validate password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }

  // Exclude password from the response
  const { password: _, ...userData } = user;

  return NextResponse.json(userData, { status: 200 });
}
