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
You are an astrology and personality analysis expert. Analyze the following emails and determine which astrological signs and traits are reflected in the writer's communication style and personality.

Emails:
${emails.join("\n\n---\n\n")}

Based on these emails, provide a detailed astrological personality analysis:

1. **Primary Zodiac Sign Traits** (Most Dominant): Identify which zodiac sign's characteristics are most prominent in their communication style. Explain why with specific examples from the emails.

2. **Secondary Zodiac Influences**: Identify 1-2 other zodiac signs that also influence their personality and communication style.

3. **Elemental Analysis**:
   - Fire (Aries, Leo, Sagittarius): Passion, enthusiasm, leadership
   - Earth (Taurus, Virgo, Capricorn): Practicality, stability, groundedness
   - Air (Gemini, Libra, Aquarius): Communication, intellect, social nature
   - Water (Cancer, Scorpio, Pisces): Emotion, intuition, empathy
   
   Rate each element's influence (0-100%) based on their writing style.

4. **Communication Modality**:
   - Cardinal (Aries, Cancer, Libra, Capricorn): Initiating, leadership
   - Fixed (Taurus, Leo, Scorpio, Aquarius): Stability, determination
   - Mutable (Gemini, Virgo, Sagittarius, Pisces): Adaptability, flexibility
   
   Identify which modality best describes their communication approach.

5. **Key Astrological Traits Observed**:
   - Leadership style
   - Emotional expression
   - Decision-making approach
   - Social interactions
   - Conflict resolution
   - Creativity and innovation

6. **Planetary Influences** (Optional but insightful):
   Identify which planets seem to influence their personality:
   - Mercury (communication)
   - Venus (relationships, harmony)
   - Mars (action, assertiveness)
   - Jupiter (optimism, growth)
   - Saturn (discipline, structure)

For each trait and sign, provide:
- Specific examples from the emails
- Percentage/strength of influence
- Behavioral patterns observed
- How this manifests in their communication

Be thorough, specific, and insightful in your analysis. Make it feel personalized and meaningful.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Error analyzing Astrology:", error);
    return NextResponse.json(
      { error: "Failed to analyze personality" },
      { status: 500 }
    );
  }
}
