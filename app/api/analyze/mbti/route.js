import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function POST(request) {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }
    
    const { emails } = await request.json(); 

    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { error: "No emails provided" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a personality analysis expert. Analyze the following emails and determine the writer's MBTI personality type.

Emails:
${emails.join("\n\n---\n\n")}

Based on these emails, provide:
1. The MBTI personality type (e.g., INTJ, ENFP, etc.)
2. Detailed explanation of why this type fits
3. Key personality traits observed
4. Communication style analysis

Be thorough and specific in your analysis.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Error analyzing MBTI:", error);
    return NextResponse.json(
      { error: "Failed to analyze personality" },
      { status: 500 }
    );
  }
}