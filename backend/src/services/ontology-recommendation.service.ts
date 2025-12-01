import { UserProfile } from '../types/index.js';
import { mockJobs } from '../data/jobs.js';
import { 
  semanticSkillMatch, 
  semanticIndustryMatch, 
  companyCultureMatch,
  skillOntology,
  industryOntology,
  companyOntology
} from '../ontology/career-ontology.js';

export interface OntologyJobMatch {
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
  // Ontology-specific fields
  skillSemanticScore: number;
  industrySemanticScore: number;
  cultureMatchScore: number;
  ontologyReasons: string[];
}

export class OntologyRecommendationService {
  
  /**
   * Enhanced semantic skill matching using ontology
   */
  private calculateSemanticSkillMatch(userSkills: string[], jobSkills: string[], jobTitle?: string): number {
    console.log(`\n🧠 ONTOLOGY: Semantic skill analysis for: ${jobTitle || 'Job'}`);
    console.log(`👤 User skills: [${userSkills.join(', ')}]`);
    console.log(`💼 Job requirements: [${jobSkills.join(', ')}]`);
    
    let totalScore = 0;
    let maxPossibleScore = jobSkills.length;
    const matchedSkills: string[] = [];
    const inferredSkills: string[] = [];
    
    for (const jobSkill of jobSkills) {
      let bestMatchScore = 0;
      let bestMatchReason = '';
      
      // Direct match
      for (const userSkill of userSkills) {
        if (userSkill.toLowerCase() === jobSkill.toLowerCase()) {
          bestMatchScore = 1.0;
          bestMatchReason = `Direct match: ${userSkill}`;
          matchedSkills.push(jobSkill);
          break;
        }
      }
      
      // If no direct match, check ontology relationships
      if (bestMatchScore === 0) {
        for (const userSkill of userSkills) {
          const relationship = this.findOntologyRelationship(userSkill, jobSkill);
          if (relationship && relationship.confidence > bestMatchScore) {
            bestMatchScore = relationship.confidence;
            bestMatchReason = relationship.reason;
            if (relationship.confidence > 0.7) {
              inferredSkills.push(`${jobSkill} (via ${userSkill})`);
            }
          }
        }
      }
      
      if (bestMatchScore > 0) {
        console.log(`  ✅ ${jobSkill}: ${(bestMatchScore * 100).toFixed(1)}% - ${bestMatchReason}`);
      } else {
        console.log(`  ❌ ${jobSkill}: 0% - No match found`);
      }
      
      totalScore += bestMatchScore;
    }
    
    const skillScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    
    console.log(`📊 Semantic skill score: ${skillScore.toFixed(1)}%`);
    if (matchedSkills.length > 0) {
      console.log(`  🎯 Direct matches: ${matchedSkills.join(', ')}`);
    }
    if (inferredSkills.length > 0) {
      console.log(`  🔍 Inferred skills: ${inferredSkills.join(', ')}`);
    }
    
    return skillScore;
  }

  /**
   * Find ontology-based relationship between skills
   */
  private findOntologyRelationship(userSkill: string, jobSkill: string): { confidence: number; reason: string } | null {
    // Check skill implications (React -> JavaScript, HTML, CSS)
    const implications = this.getSkillImplications(userSkill);
    if (implications.includes(jobSkill.toLowerCase())) {
      return { confidence: 0.9, reason: `${userSkill} implies ${jobSkill}` };
    }
    
    // Check if skills are in the same category
    const userCategory = this.findSkillInOntology(userSkill);
    const jobCategory = this.findSkillInOntology(jobSkill);
    
    if (userCategory && jobCategory && userCategory === jobCategory) {
      return { confidence: 0.7, reason: `Same category: ${userCategory}` };
    }
    
    // Check for related skills
    const relatedSkills = this.getRelatedSkills(userSkill);
    if (relatedSkills.includes(jobSkill.toLowerCase())) {
      return { confidence: 0.8, reason: `Related skill to ${userSkill}` };
    }
    
    // Check for transferable skills (TensorFlow <-> PyTorch)
    const transferableSkills = this.getTransferableSkills(userSkill);
    if (transferableSkills.includes(jobSkill.toLowerCase())) {
      return { confidence: 0.75, reason: `Transferable from ${userSkill}` };
    }
    
    return null;
  }

  private getSkillImplications(skill: string): string[] {
    const skillData = this.findSkillData(skill);
    return skillData?.subSkills?.map(s => s.toLowerCase()) || [];
  }

  private getRelatedSkills(skill: string): string[] {
    const skillData = this.findSkillData(skill);
    return skillData?.relatedSkills?.map(s => s.toLowerCase()) || [];
  }

  private getTransferableSkills(skill: string): string[] {
    // This would be expanded with more ontology rules
    const transferMap: { [key: string]: string[] } = {
      'tensorflow': ['pytorch', 'keras', 'scikit-learn'],
      'pytorch': ['tensorflow', 'keras'],
      'react': ['vue.js', 'angular'],
      'vue.js': ['react', 'angular'],
      'angular': ['react', 'vue.js']
    };
    
    return transferMap[skill.toLowerCase()] || [];
  }

  private findSkillData(skill: string): any {
    for (const category of Object.values(skillOntology)) {
      for (const [skillName, skillData] of Object.entries(category)) {
        if (skillName.toLowerCase() === skill.toLowerCase()) {
          return skillData;
        }
      }
    }
    return null;
  }

  private findSkillInOntology(skill: string): string | null {
    for (const [category, skills] of Object.entries(skillOntology)) {
      for (const skillName of Object.keys(skills)) {
        if (skillName.toLowerCase() === skill.toLowerCase()) {
          return category;
        }
      }
    }
    return null;
  }

  /**
   * Enhanced experience matching with ontology rules
   */
  private calculateSemanticExperienceMatch(userExperience: number, requiredExperience: number, userRole: string, jobTitle: string): number {
    console.log(`👔 ONTOLOGY: Experience analysis`);
    console.log(`  Current role: ${userRole} (${userExperience} years)`);
    console.log(`  Target role: ${jobTitle} (requires ${requiredExperience} years)`);
    
    let baseScore = 0;
    
    // Basic experience calculation
    if (userExperience >= requiredExperience) {
      baseScore = 100;
      console.log(`  ✅ Experience: 100% (meets requirement)`);
    } else if (userExperience >= requiredExperience * 0.7) {
      baseScore = (userExperience / requiredExperience) * 100;
      console.log(`  ⚠️  Experience: ${baseScore.toFixed(1)}% (close to requirement)`);
    } else {
      console.log(`  ❌ Experience: Below threshold`);
    }
    
    // Apply role transferability bonus
    const transferBonus = this.calculateRoleTransferability(userRole, jobTitle);
    const finalScore = Math.min(100, baseScore + transferBonus);
    
    if (transferBonus > 0) {
      console.log(`  🔄 Role transfer bonus: +${transferBonus}% (${userRole} -> ${jobTitle})`);
      console.log(`  📊 Final experience score: ${finalScore}%`);
    }
    
    return finalScore;
  }

  private calculateRoleTransferability(currentRole: string, targetRole: string): number {
    // Role transferability rules
    const transferRules: { [key: string]: { [key: string]: number } } = {
      'frontend developer': {
        'full stack developer': 15,
        'ui/ux developer': 20,
        'senior frontend developer': 10
      },
      'backend developer': {
        'full stack developer': 15,
        'devops engineer': 10,
        'senior backend developer': 10
      },
      'software engineer': {
        'senior software engineer': 10,
        'full stack developer': 5,
        'backend developer': 5,
        'frontend developer': 5
      }
    };
    
    const currentLower = currentRole.toLowerCase();
    const targetLower = targetRole.toLowerCase();
    
    return transferRules[currentLower]?.[targetLower] || 0;
  }

  /**
   * Generate ontology-based match reasons
   */
  private generateOntologyReasons(
    skillScore: number,
    industryScore: number,
    cultureScore: number,
    userSkills: string[],
    jobSkills: string[],
    company: string
  ): string[] {
    const reasons: string[] = [];
    
    if (skillScore >= 80) {
      const inferredCount = this.countInferredSkills(userSkills, jobSkills);
      if (inferredCount > 0) {
        reasons.push(`Semantic skill analysis shows ${inferredCount} transferable skills`);
      }
      reasons.push('Strong technical skill alignment');
    }
    
    if (industryScore >= 85) {
      reasons.push('Industry expertise directly applicable');
    } else if (industryScore >= 70) {
      reasons.push('Related industry experience transferable');
    }
    
    if (cultureScore >= 80) {
      reasons.push(`Excellent cultural fit with ${company}'s values and tech stack`);
    }
    
    return reasons;
  }

  private countInferredSkills(userSkills: string[], jobSkills: string[]): number {
    let count = 0;
    for (const jobSkill of jobSkills) {
      for (const userSkill of userSkills) {
        const relationship = this.findOntologyRelationship(userSkill, jobSkill);
        if (relationship && relationship.confidence > 0.7) {
          count++;
          break;
        }
      }
    }
    return count;
  }

  /**
   * Get ontology-based job recommendations
   */
  async getOntologyRecommendations(profile: UserProfile): Promise<OntologyJobMatch[]> {
    console.log(`\n🧠 ONTOLOGY RECOMMENDATION ENGINE STARTED`);
    console.log(`🎯 Analyzing profile: ${profile.name} - ${profile.currentRole}`);
    console.log(`📊 Using semantic matching and knowledge graphs\n`);
    
    const recommendations: OntologyJobMatch[] = [];

    for (const job of mockJobs) {
      console.log(`\n${'='.repeat(90)}`);
      console.log(`🏢 ONTOLOGY ANALYSIS: ${job.title} at ${job.company}`);
      
      // Semantic calculations
      const skillSemanticScore = this.calculateSemanticSkillMatch(profile.skills, job.requiredSkills, `${job.title} at ${job.company}`);
      const experienceScore = this.calculateSemanticExperienceMatch(profile.yearsOfExperience, job.requiredExperience, profile.currentRole, job.title);
      const industrySemanticScore = semanticIndustryMatch(profile.preferredIndustry, job.industry);
      const cultureMatchScore = companyCultureMatch(profile, job.company);
      
      console.log(`🏢 Industry semantic match: ${industrySemanticScore}%`);
      console.log(`🎭 Company culture match: ${cultureMatchScore}%`);
      
      // Ontology-weighted scoring (different from rule-based)
      const ontologyScore = Math.round(
        (skillSemanticScore * 0.5) +     // 50% semantic skills
        (experienceScore * 0.25) +       // 25% experience
        (industrySemanticScore * 0.15) + // 15% industry
        (cultureMatchScore * 0.1)        // 10% culture
      );
      
      console.log(`\n🧮 ONTOLOGY CALCULATION:`);
      console.log(`  Semantic Skills: ${skillSemanticScore.toFixed(1)}% × 0.5 = ${(skillSemanticScore * 0.5).toFixed(1)}`);
      console.log(`  Experience: ${experienceScore.toFixed(1)}% × 0.25 = ${(experienceScore * 0.25).toFixed(1)}`);
      console.log(`  Industry: ${industrySemanticScore.toFixed(1)}% × 0.15 = ${(industrySemanticScore * 0.15).toFixed(1)}`);
      console.log(`  Culture: ${cultureMatchScore.toFixed(1)}% × 0.1 = ${(cultureMatchScore * 0.1).toFixed(1)}`);
      console.log(`  🧠 ONTOLOGY SCORE: ${ontologyScore}%`);

      // Lower threshold for ontology (25%) due to more sophisticated matching
      if (ontologyScore >= 25) {
        console.log(`  ✅ QUALIFIED - Adding to ontology recommendations`);
        
        const ontologyReasons = this.generateOntologyReasons(
          skillSemanticScore, industrySemanticScore, cultureMatchScore,
          profile.skills, job.requiredSkills, job.company
        );
        
        // Generate traditional match reasons for compatibility
        const matchReasons = this.generateTraditionalReasons(skillSemanticScore, experienceScore, industrySemanticScore);

        recommendations.push({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salaryRange: job.salaryRange,
          industry: job.industry,
          workStyle: job.workStyle,
          description: job.description,
          matchScore: ontologyScore,
          matchReasons,
          requiredSkills: job.requiredSkills,
          experienceMatch: experienceScore >= 70,
          companySize: job.companySize,
          benefits: job.benefits,
          // Ontology-specific fields
          skillSemanticScore,
          industrySemanticScore,
          cultureMatchScore,
          ontologyReasons
        });
      } else {
        console.log(`  ❌ REJECTED - Ontology score ${ontologyScore}% below 25% threshold`);
      }
    }

    // Sort by ontology match score
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    console.log(`\n${'='.repeat(90)}`);
    console.log(`🧠 ONTOLOGY RESULTS: Found ${recommendations.length} qualifying positions`);
    console.log(`🏆 Top ${sortedRecommendations.length} ontology-based recommendations:`);
    
    sortedRecommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec.title} at ${rec.company} - ${rec.matchScore}% (Semantic)`);
    });
    
    console.log(`\n✅ Ontology analysis complete!\n`);
    
    return sortedRecommendations;
  }

  private generateTraditionalReasons(skillScore: number, experienceScore: number, industryScore: number): string[] {
    const reasons: string[] = [];
    
    if (skillScore >= 70) reasons.push('Strong technical skills alignment');
    if (experienceScore >= 100) reasons.push('Meets experience requirements');
    else if (experienceScore >= 70) reasons.push('Close to experience requirements');
    if (industryScore >= 80) reasons.push('Industry experience match');
    
    return reasons;
  }
}