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
You are a personality analysis expert. Analyze the following emails and determine the writer's Big Five personality traits.

Emails:
${emails.join("\n\n---\n\n")}

Based on these emails, provide a detailed Big Five personality analysis:

1. **Openness to Experience** (0-100%): How creative, curious, and open to new ideas
2. **Conscientiousness** (0-100%): How organized, responsible, and goal-oriented
3. **Extraversion** (0-100%): How outgoing, energetic, and social
4. **Agreeableness** (0-100%): How cooperative, compassionate, and friendly
5. **Neuroticism** (0-100%): How sensitive to stress and emotional

For each trait, provide:
- A percentage score
- Detailed explanation with examples from the emails
- Key behavioral patterns observed

Be thorough and specific in your analysis.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Error analyzing Big5:", error);
    return NextResponse.json(
      { error: "Failed to analyze personality" },
      { status: 500 }
    );
  }
}