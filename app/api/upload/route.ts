// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises"; // Using promises API is better
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Generate safe filename
    const fileExt = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      name: fileName, // Return sanitized name
      path: `/uploads/${fileName}`, // Public accessible path
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
};
