export interface UserProfile {
  name: string;
  currentRole: string;
  yearsOfExperience: number;
  skills: string[];
  preferredIndustry: string;
  workStyle: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  about: string;
}

export interface JobRecommendation {
  companyName: string;
  roleTitle: string;
  matchScore: number;
  salaryRange: string;
  location: string;
  reasoning: string;
  keyRequirements: string[];
  cultureFit: string;
}

export interface RecommendationsResponse {
  recommendations: JobRecommendation[];
}
