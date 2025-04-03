import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a financial assistant that extracts expense information from voice transcripts. 
          Return a JSON object with these fields: 
          - amount (number, required)
          - category (string, required)
          - date (string in YYYY-MM-DD format, default to today if not mentioned)
          - reason (string, optional)
          
          Example: 
          {
            "amount": 25.50,
            "category": "Food",
            "date": "2023-11-15",
            "reason": "Lunch with client"
          }`,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const data = JSON.parse(content);

    // Validate required fields
    if (!data.amount || !data.category || !data.date) {
      throw new Error("Missing required fields in response");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error processing with OpenAI:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process voice input",
      },
      { status: 500 }
    );
  }
}
