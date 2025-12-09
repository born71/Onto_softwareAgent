export interface UserProfile {
  id?: string;
  name: string;
  currentRole: string;
  yearsOfExperience: number;
  skills: string[];
  preferredIndustry: string;
  workStyle: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  expectedSalary: number;
  about: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  industry: string;
  workStyle: string[];
  description: string;
  matchScore: number;
  matchReasons: string[];
  requiredSkills: string[];
  experienceMatch: boolean;
  companySize?: string;
  benefits?: string[];
}

export interface RecommendationsResponse {
  recommendations: JobMatch[];
  totalCount: number;
  profile: {
    name: string;
    currentRole: string;
  };
}
