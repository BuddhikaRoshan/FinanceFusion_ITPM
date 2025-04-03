import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createReadStream } from "fs";
import { promises as fs } from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure the audios directory exists
    const audiosDirPath = path.join(process.cwd(), "public", "audios");
    await fs.mkdir(audiosDirPath, { recursive: true });

    // Create file path in public/audios
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(audiosDirPath, fileName);
    await fs.writeFile(filePath, buffer);

    // Create file stream
    const fileStream = createReadStream(filePath);

    // Transcribe audio
    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1",
      response_format: "json",
    });

    // We're not deleting the file since we want to keep it in public/audios

    return NextResponse.json(
      {
        transcript: transcription.text,
        audioUrl: `/audios/${fileName}`, // Return the public URL to the audio file
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error transcribing audio:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to transcribe audio",
      },
      { status: 500 }
    );
  }
}
