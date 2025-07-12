import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeTicket = async (title, description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    Analyze this support ticket and provide:
    1. Category (technical, billing, general, bug, feature)
    2. Priority (low, medium, high, urgent)
    3. Helpful notes for the moderator

    Title: ${title}
    Description: ${description}

    Respond in JSON format:
    {
      "category": "category_here",
      "priority": "priority_here",
      "notes": "helpful notes for moderator"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      return JSON.parse(text);
    } catch {
      // Fallback if AI doesn't return valid JSON
      return {
        category: "general",
        priority: "medium",
        notes: "AI analysis failed. Please review manually.",
      };
    }
  } catch (error) {
    console.error("AI analysis failed:", error);
    return {
      category: "general",
      priority: "medium",
      notes: "AI analysis unavailable. Please review manually.",
    };
  }
};