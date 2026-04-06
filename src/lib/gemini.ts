import { GoogleGenAI, Type } from "@google/genai";
import { ParsedResume, ATSAnalysis, JobMatchAnalysis } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    personalDetails: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
        portfolio: { type: Type.STRING },
      },
      required: ["name", "email", "phone", "location"],
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["degree", "institution", "startDate", "endDate"],
      },
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          responsibilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["role", "company", "startDate", "endDate", "responsibilities"],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          link: { type: Type.STRING },
        },
        required: ["name", "description", "technologies"],
      },
    },
    atsAnalysis: {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.NUMBER },
        parsingRate: { type: Type.NUMBER },
        isAtsFriendly: { type: Type.BOOLEAN },
        germanMarketSuitability: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
        },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["overallScore", "parsingRate", "isAtsFriendly", "germanMarketSuitability", "strengths", "weaknesses", "recommendations"],
    },
  },
  required: ["personalDetails", "education", "experience", "skills", "projects", "atsAnalysis"],
};

const jobMatchSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.NUMBER },
    chancesOfCall: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    missingTechnicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingSoftSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingResponsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
    feedback: { type: Type.STRING },
    actionableChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["matchScore", "chancesOfCall", "missingTechnicalSkills", "missingSoftSkills", "missingResponsibilities", "feedback", "actionableChanges"],
};

export async function parseResume(resumeText: string): Promise<{ parsedResume: ParsedResume; atsAnalysis: ATSAnalysis }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze the following resume text. 
      1. Extract all structured information (personal details, education, experience, skills, projects).
      2. Perform a strict ATS analysis, specifically for the German job market (companies in Germany).
      3. Evaluate "parsingRate" based on how structured and scannable the resume is.
      4. "isAtsFriendly" should be true only if the resume uses standard headings, clear structure, and no complex formatting that breaks parsers.
      5. Provide feedback on "germanMarketSuitability" (e.g., mention if it follows German standards like clear dates, specific details, etc.).

      Resume Text:
      ${resumeText}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
    },
  });

  const result = JSON.parse(response.text);
  const { atsAnalysis, ...parsedResume } = result;
  return { parsedResume, atsAnalysis };
}

export async function analyzeJobMatch(parsedResume: ParsedResume, jobDescription: string): Promise<JobMatchAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze the suitability of this candidate for the following job description.
      
      Candidate Resume Data:
      ${JSON.stringify(parsedResume, null, 2)}
      
      Job Description:
      ${jobDescription}
      
      Provide:
      1. A match score (0-100).
      2. Chances of getting a call (High, Medium, Low).
      3. Missing technical skills, soft skills, and responsibilities.
      4. Detailed feedback.
      5. Actionable changes to the resume to achieve a 100% match for this specific role and pass ATS perfectly.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: jobMatchSchema,
    },
  });

  return JSON.parse(response.text);
}
