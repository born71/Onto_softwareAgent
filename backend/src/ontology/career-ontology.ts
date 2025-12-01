// Example ontology-based design concepts for the career recommendation system

/**
 * ONTOLOGY DESIGN APPROACH
 * 
 * An ontology defines:
 * 1. Classes (concepts) - Job, Skill, Industry, Company, Person
 * 2. Properties (relationships) - hasSkill, requiresSkill, worksIn, offers
 * 3. Instances (individuals) - specific jobs, people, companies
 * 4. Rules and axioms - semantic relationships and inference rules
 */

// 1. SKILL ONTOLOGY - Hierarchical relationships between skills
export const skillOntology = {
  // Programming Languages
  "Programming": {
    "JavaScript": {
      subSkills: ["React", "Node.js", "Vue.js", "Angular"],
      relatedSkills: ["TypeScript", "HTML", "CSS"],
      level: "foundational"
    },
    "TypeScript": {
      parentSkills: ["JavaScript"],
      enhances: ["React", "Node.js"],
      level: "intermediate"
    },
    "Python": {
      subSkills: ["Django", "FastAPI", "Flask", "Pandas", "TensorFlow"],
      relatedSkills: ["SQL", "Machine Learning"],
      level: "foundational"
    }
  },
  
  // Frameworks & Libraries
  "Frontend": {
    "React": {
      parentSkills: ["JavaScript"],
      relatedSkills: ["Redux", "GraphQL", "Webpack"],
      alternatives: ["Vue.js", "Angular"],
      level: "intermediate"
    }
  },
  
  // Domains
  "MachineLearning": {
    "TensorFlow": {
      parentSkills: ["Python"],
      relatedSkills: ["Neural Networks", "Deep Learning"],
      alternatives: ["PyTorch", "Scikit-learn"],
      level: "advanced"
    }
  }
};

// 2. INDUSTRY ONTOLOGY - Semantic relationships between industries
export const industryOntology = {
  "Technology": {
    subIndustries: ["Software", "Hardware", "Cloud Computing", "AI/ML"],
    relatedIndustries: ["Fintech", "Healthtech", "Edtech"],
    skills: ["Programming", "System Design", "DevOps"]
  },
  
  "Fintech": {
    parentIndustries: ["Technology", "Finance"],
    specificSkills: ["Payment Systems", "Blockchain", "Financial APIs"],
    regulations: ["PCI Compliance", "KYC", "AML"]
  },
  
  "Healthcare": {
    subIndustries: ["Telemedicine", "Medical Devices", "Pharmaceuticals"],
    regulations: ["HIPAA", "FDA", "GDPR"],
    specificSkills: ["Healthcare APIs", "Medical Data", "Compliance"]
  }
};

// 3. COMPANY ONTOLOGY - Company characteristics and culture
export const companyOntology = {
  "Google": {
    type: "BigTech",
    size: "Large",
    culture: ["Innovation", "Data-Driven", "Research"],
    technologies: ["Cloud", "AI/ML", "Distributed Systems"],
    workStyle: ["Hybrid", "Remote-Friendly"],
    values: ["Technical Excellence", "Scale", "Impact"]
  },
  
  "Stripe": {
    type: "Fintech",
    size: "Unicorn",
    culture: ["Developer-First", "Global", "Infrastructure"],
    technologies: ["Payment Systems", "APIs", "Microservices"],
    workStyle: ["Remote-First"],
    values: ["Reliability", "Developer Experience", "Global Scale"]
  }
};

// 4. ONTOLOGY-BASED MATCHING RULES
export const ontologyRules = {
  // Skill inference rules
  skillInference: {
    // If someone knows React, they likely know JavaScript
    "React": { implies: ["JavaScript", "HTML", "CSS"], confidence: 0.9 },
    // TypeScript enhances JavaScript knowledge
    "TypeScript": { enhances: ["JavaScript"], multiplier: 1.2 },
    // Machine Learning skills are transferable
    "TensorFlow": { transferable: ["PyTorch", "Machine Learning"], confidence: 0.7 }
  },
  
  // Industry proximity rules
  industryProximity: {
    "Technology": { 
      similar: ["Fintech", "Healthtech", "Edtech"], 
      similarity: 0.8 
    },
    "Fintech": { 
      similar: ["Banking", "Insurance", "Investment"], 
      similarity: 0.9 
    }
  },
  
  // Experience transferability
  experienceTransfer: {
    "Frontend Developer": {
      transferable: ["Full Stack Developer", "UI/UX Developer"],
      penalty: 0.1 // 10% reduction in match score
    },
    "Backend Engineer": {
      transferable: ["DevOps Engineer", "Platform Engineer"],
      penalty: 0.15
    }
  }
};

/**
 * SEMANTIC MATCHING FUNCTIONS
 * These would replace the simple string matching
 */

// Semantic skill matching using ontology
export function semanticSkillMatch(userSkills: string[], jobSkills: string[]): number {
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  for (const jobSkill of jobSkills) {
    maxPossibleScore += 1;
    let bestMatch = 0;
    
    for (const userSkill of userSkills) {
      // Direct match
      if (userSkill.toLowerCase() === jobSkill.toLowerCase()) {
        bestMatch = Math.max(bestMatch, 1.0);
        continue;
      }
      
      // Ontology-based matching
      const skillRelation = findSkillRelationship(userSkill, jobSkill);
      if (skillRelation) {
        bestMatch = Math.max(bestMatch, skillRelation.confidence);
      }
    }
    
    totalScore += bestMatch;
  }
  
  return maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
}

// Find semantic relationship between skills
function findSkillRelationship(skill1: string, skill2: string): { confidence: number } | null {
  // Check if skill1 implies skill2
  const implications = (ontologyRules.skillInference as any)[skill1];
  if (implications?.implies?.includes(skill2)) {
    return { confidence: implications.confidence };
  }
  
  // Check if they're in the same skill family
  const skill1Category = findSkillCategory(skill1);
  const skill2Category = findSkillCategory(skill2);
  
  if (skill1Category === skill2Category) {
    return { confidence: 0.6 }; // Same category, moderate match
  }
  
  return null;
}

// Industry semantic matching
export function semanticIndustryMatch(userIndustry: string, jobIndustry: string): number {
  if (userIndustry.toLowerCase() === jobIndustry.toLowerCase()) {
    return 100;
  }
  
  // Check ontology for industry relationships
  const industryData = (industryOntology as any)[jobIndustry];
  if (industryData?.relatedIndustries?.includes(userIndustry)) {
    return 85; // High match for related industries
  }
  
  if (industryData?.parentIndustries?.includes(userIndustry) || 
      industryData?.subIndustries?.includes(userIndustry)) {
    return 90; // Very high match for parent/child relationship
  }
  
  return 0;
}

// Company culture matching
export function companyCultureMatch(userProfile: any, company: string): number {
  const companyData = (companyOntology as any)[company];
  if (!companyData) return 50; // Default score if no data
  
  let cultureScore = 0;
  let factors = 0;
  
  // Match work style preference
  if (companyData.workStyle.includes(userProfile.workStyle)) {
    cultureScore += 100;
    factors += 1;
  }
  
  // Match based on company size preference (if user specified)
  if (userProfile.preferredCompanySize === companyData.size) {
    cultureScore += 100;
    factors += 1;
  }
  
  // Technology stack alignment
  const techAlignment = calculateTechStackAlignment(userProfile.skills, companyData.technologies);
  cultureScore += techAlignment;
  factors += 1;
  
  return factors > 0 ? cultureScore / factors : 50;
}

function calculateTechStackAlignment(userSkills: string[], companyTech: string[]): number {
  const matches = userSkills.filter(skill => 
    companyTech.some(tech => 
      tech.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(tech.toLowerCase())
    )
  );
  
  return companyTech.length > 0 ? (matches.length / companyTech.length) * 100 : 50;
}

function findSkillCategory(skill: string): string | null {
  for (const [category, skills] of Object.entries(skillOntology)) {
    if ((skills as any)[skill]) {
      return category;
    }
    // Check nested skills
    for (const [subSkill, subData] of Object.entries(skills)) {
      if (typeof subData === 'object' && (subData as any).subSkills?.includes(skill)) {
        return category;
      }
    }
  }
  return null;
}