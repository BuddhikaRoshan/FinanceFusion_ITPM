import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { expenseSchema } from "@/schemas/expense.schema";

const prisma = new PrismaClient();

// Create a new expense
export async function POST(request: Request) {
  const body = await request.json();
  const validation = expenseSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: validation.data,
  });

  return NextResponse.json(expense, { status: 201 });
}

// Get all expenses
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const expenses = await prisma.expense.findMany({
    where: { userId },
  });

  return NextResponse.json(expenses, { status: 200 });
}

// Update an expense
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Expense ID is required" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const validation = expenseSchema.partial().safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const expense = await prisma.expense.update({
    where: { id },
    data: validation.data,
  });

  return NextResponse.json(expense, { status: 200 });
}

// Delete an expense
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Expense ID is required" },
      { status: 400 }
    );
  }

  await prisma.expense.delete({
    where: { id },
  });

  return NextResponse.json(
    { message: "Expense deleted successfully" },
    { status: 200 }
  );
}
