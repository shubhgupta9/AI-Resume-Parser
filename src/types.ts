export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ProfessionalExperience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ParsedResume {
  personalDetails: PersonalDetails;
  education: Education[];
  experience: ProfessionalExperience[];
  skills: string[];
  projects: Project[];
}

export interface ATSAnalysis {
  overallScore: number; // 0-100
  parsingRate: number; // 0-100 (how well it was parsed/structured)
  isAtsFriendly: boolean;
  germanMarketSuitability: {
    score: number;
    feedback: string;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface JobMatchAnalysis {
  matchScore: number; // 0-100
  chancesOfCall: "High" | "Medium" | "Low";
  missingTechnicalSkills: string[];
  missingSoftSkills: string[];
  missingResponsibilities: string[];
  feedback: string;
  actionableChanges: string[];
  exactChanges: {
    section: string;
    change: string;
    reason: string;
  }[];
}

export interface AnalysisResult {
  parsedResume: ParsedResume;
  atsAnalysis: ATSAnalysis;
  jobMatch?: JobMatchAnalysis;
  coverLetter?: string;
}
