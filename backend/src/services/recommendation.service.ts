import { UserProfile } from '../types/index.js';
import { mockJobs } from '../data/jobs.js';

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

export class RecommendationService {
  
  /**
   * Calculate skill match percentage
   */
  private calculateSkillMatch(userSkills: string[], jobSkills: string[], jobTitle?: string): number {
    console.log(`\n🔍 Analyzing skills for: ${jobTitle || 'Job'}`);
    console.log(`👤 User skills: [${userSkills.join(', ')}]`);
    console.log(`💼 Job requirements: [${jobSkills.join(', ')}]`);
    
    const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
    const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase());
    
    const matchingSkills = jobSkillsLower.filter(jobSkill => {
      const isMatch = userSkillsLower.some(userSkill => 
        userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
      );
      if (isMatch) {
        console.log(`  ✅ Match found: "${jobSkill}"`);
      } else {
        console.log(`  ❌ No match: "${jobSkill}"`);
      }
      return isMatch;
    });
    
    const skillScore = jobSkillsLower.length > 0 ? (matchingSkills.length / jobSkillsLower.length) * 100 : 0;
    console.log(`📊 Skill match score: ${skillScore.toFixed(1)}% (${matchingSkills.length}/${jobSkillsLower.length} skills matched)`);
    
    return skillScore;
  }

  /**
   * Calculate experience match
   */
  private calculateExperienceMatch(userExperience: number, requiredExperience: number): number {
    console.log(`👔 Experience check: User has ${userExperience} years, Job requires ${requiredExperience} years`);
    
    let experienceScore = 0;
    if (userExperience >= requiredExperience) {
      experienceScore = 100;
      console.log(`  ✅ Experience match: 100% (exceeds requirement)`);
    } else if (userExperience >= requiredExperience * 0.7) {
      // If user has at least 70% of required experience, give partial points
      experienceScore = (userExperience / requiredExperience) * 100;
      console.log(`  ⚠️  Experience match: ${experienceScore.toFixed(1)}% (close to requirement)`);
    } else {
      experienceScore = 0;
      console.log(`  ❌ Experience match: 0% (below 70% threshold)`);
    }
    
    return experienceScore;
  }

  /**
   * Calculate industry match
   */
  private calculateIndustryMatch(userIndustry: string, jobIndustry: string): number {
    console.log(`🏢 Industry check: User prefers "${userIndustry}", Job is in "${jobIndustry}"`);
    
    const userIndustryLower = userIndustry.toLowerCase();
    const jobIndustryLower = jobIndustry.toLowerCase();
    
    let industryScore = 0;
    if (userIndustryLower === jobIndustryLower) {
      industryScore = 100;
      console.log(`  ✅ Perfect industry match: 100%`);
    } else if (userIndustryLower.includes(jobIndustryLower) || jobIndustryLower.includes(userIndustryLower)) {
      industryScore = 80;
      console.log(`  ⚠️  Partial industry match: 80%`);
    } else {
      industryScore = 0;
      console.log(`  ❌ No industry match: 0%`);
    }
    
    return industryScore;
  }

  /**
   * Calculate work style match
   */
  private calculateWorkStyleMatch(userWorkStyle: string, jobWorkStyles: string[]): number {
    console.log(`🏠 Work style check: User wants "${userWorkStyle}", Job offers [${jobWorkStyles.join(', ')}]`);
    
    let workStyleScore = 0;
    if (userWorkStyle === 'Any' || jobWorkStyles.includes('Any')) {
      workStyleScore = 100;
      console.log(`  ✅ Work style match: 100% (flexible options)`);
    } else if (jobWorkStyles.includes(userWorkStyle)) {
      workStyleScore = 100;
      console.log(`  ✅ Work style match: 100% (exact preference match)`);
    } else {
      workStyleScore = 0;
      console.log(`  ❌ Work style match: 0% (preference not available)`);
    }
    
    return workStyleScore;
  }

  /**
   * Generate match reasons
   */
  private generateMatchReasons(
    skillMatch: number, 
    experienceMatch: number, 
    industryMatch: number, 
    workStyleMatch: number,
    userSkills: string[],
    jobSkills: string[]
  ): string[] {
    const reasons: string[] = [];
    
    if (skillMatch >= 60) {
      const matchingSkills = jobSkills.filter(jobSkill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(jobSkill.toLowerCase()) || 
          jobSkill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      reasons.push(`Strong skill match: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    
    if (experienceMatch >= 100) {
      reasons.push('Meets experience requirements');
    } else if (experienceMatch >= 70) {
      reasons.push('Close to experience requirements');
    }
    
    if (industryMatch >= 80) {
      reasons.push('Perfect industry fit');
    }
    
    if (workStyleMatch >= 100) {
      reasons.push('Work style preference match');
    }
    
    return reasons;
  }

  /**
   * Get job recommendations for a user
   */
  async getRecommendations(profile: UserProfile): Promise<JobMatch[]> {
    console.log(`\n🚀 Starting job recommendation analysis for: ${profile.name}`);
    console.log(`📋 Profile summary: ${profile.currentRole} with ${profile.yearsOfExperience} years experience`);
    console.log(`🎯 Looking for: ${profile.preferredIndustry} industry, ${profile.workStyle} work style`);
    console.log(`💪 Skills: [${profile.skills.join(', ')}]`);
    console.log(`\n📊 Analyzing ${mockJobs.length} available positions...\n`);
    
    const recommendations: JobMatch[] = [];

    for (const job of mockJobs) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`🏢 Evaluating: ${job.title} at ${job.company}`);
      
      // Calculate different match scores
      const skillMatch = this.calculateSkillMatch(profile.skills, job.requiredSkills, `${job.title} at ${job.company}`);
      const experienceMatch = this.calculateExperienceMatch(profile.yearsOfExperience, job.requiredExperience);
      const industryMatch = this.calculateIndustryMatch(profile.preferredIndustry, job.industry);
      const workStyleMatch = this.calculateWorkStyleMatch(profile.workStyle, job.workStyle);

      // Calculate overall match score (weighted average)
      const overallScore = Math.round(
        (skillMatch * 0.4) + // 40% weight on skills
        (experienceMatch * 0.3) + // 30% weight on experience
        (industryMatch * 0.2) + // 20% weight on industry
        (workStyleMatch * 0.1) // 10% weight on work style
      );

      console.log(`\n🧮 Final Calculation:`);
      console.log(`  Skills: ${skillMatch.toFixed(1)}% × 0.4 = ${(skillMatch * 0.4).toFixed(1)}`);
      console.log(`  Experience: ${experienceMatch.toFixed(1)}% × 0.3 = ${(experienceMatch * 0.3).toFixed(1)}`);
      console.log(`  Industry: ${industryMatch.toFixed(1)}% × 0.2 = ${(industryMatch * 0.2).toFixed(1)}`);
      console.log(`  Work Style: ${workStyleMatch.toFixed(1)}% × 0.1 = ${(workStyleMatch * 0.1).toFixed(1)}`);
      console.log(`  🎯 TOTAL SCORE: ${overallScore}%`);

      // Only include jobs with reasonable match (>= 30%)
      if (overallScore >= 30) {
        console.log(`  ✅ QUALIFIED - Adding to recommendations`);
        
        const matchReasons = this.generateMatchReasons(
          skillMatch, experienceMatch, industryMatch, workStyleMatch,
          profile.skills, job.requiredSkills
        );

        recommendations.push({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salaryRange: job.salaryRange,
          industry: job.industry,
          workStyle: job.workStyle,
          description: job.description,
          matchScore: overallScore,
          matchReasons,
          requiredSkills: job.requiredSkills,
          experienceMatch: experienceMatch >= 70,
          companySize: job.companySize,
          benefits: job.benefits
        });
      } else {
        console.log(`  ❌ REJECTED - Score ${overallScore}% below 30% threshold`);
      }
    }

    // Sort by match score (highest first) and return top 10
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    console.log(`\n${'='.repeat(80)}`);
    console.log(`🏆 FINAL RESULTS: Found ${recommendations.length} qualifying positions`);
    console.log(`📈 Returning top ${sortedRecommendations.length} recommendations:`);
    
    sortedRecommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec.title} at ${rec.company} - ${rec.matchScore}%`);
    });
    
    console.log(`\n✅ Analysis complete!\n`);
    
    return sortedRecommendations;
  }
}