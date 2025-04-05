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
          content: `You are a financial assistant that extracts income information from voice transcripts. 
          Return a JSON object with these fields: 
          - amount (number, required) - must be a positive number
          - source (string, required) - common sources: Salary, Freelance, Investment, Bonus, Gift
          - date (string in YYYY-MM-DD format) - default to today if not mentioned
          
          Handle various date formats:
          - "today" => current date
          - "yesterday" => previous date
          - "last week" => approximate date
          - "15th of July" => specific date
          
          Example output: 
          {
            "amount": 2500.00,
            "source": "Salary",
            "date": "2023-11-15"
          }`,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2, // Lower temperature for more consistent results
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const data = JSON.parse(content);

    // Validate required fields
    if (!data.amount || !data.source || !data.date) {
      throw new Error("Missing required fields in response");
    }

    // Additional validation
    if (typeof data.amount !== "number" || data.amount <= 0) {
      throw new Error("Amount must be a positive number");
    }

    if (typeof data.source !== "string" || data.source.trim().length === 0) {
      throw new Error("Source must be a non-empty string");
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
