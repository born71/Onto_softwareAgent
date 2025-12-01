export interface UserProfile {
  id?: string;
  name: string;
  currentRole: string;
  yearsOfExperience: number;
  skills: string[];
  preferredIndustry: string;
  workStyle: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  about: string;
}
