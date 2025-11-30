import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RecommendationsResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCareerMatches = async (profile: UserProfile): Promise<RecommendationsResponse> => {
  const modelId = "gemini-2.5-flash"; // Efficient for structured data tasks

  const prompt = `
    Act as a senior executive recruiter and career coach.
    Analyze the following candidate profile and recommend 5 specific job opportunities at real or realistic types of companies.
    
    Candidate Profile:
    - Current Role: ${profile.currentRole}
    - Experience: ${profile.yearsOfExperience} years
    - Skills: ${profile.skills.join(", ")}
    - Preferred Industry: ${profile.preferredIndustry}
    - Work Style Preference: ${profile.workStyle}
    - Professional Summary: ${profile.about}

    Task:
    1. Identify 5 companies (mix of Big Tech, Startups, and Enterprise) that would highly value this specific skill set.
    2. For each, suggest a specific role title.
    3. Calculate a "Match Score" (0-100) based on skills, experience, and industry fit.
    4. Provide a salary range estimate based on current market trends for this experience level.
    5. Explain the reasoning for the match and list key requirements the candidate meets.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  companyName: { type: Type.STRING },
                  roleTitle: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                  salaryRange: { type: Type.STRING },
                  location: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  keyRequirements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  cultureFit: { type: Type.STRING, description: "A short sentence about why the company culture fits." }
                },
                required: ["companyName", "roleTitle", "matchScore", "salaryRange", "location", "reasoning", "keyRequirements", "cultureFit"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text from Gemini");
    }
    
    return JSON.parse(text) as RecommendationsResponse;
  } catch (error) {
    console.error("Error fetching career matches:", error);
    throw error;
  }
};