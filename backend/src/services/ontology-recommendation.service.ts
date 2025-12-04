import { UserProfile } from '../types/index.js';
import { Neo4jService } from './neo4j.service.js';

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
  private neo4jService: Neo4jService;

  constructor() {
    this.neo4jService = new Neo4jService();
  }

  /**
   * Get ontology-based job recommendations using Neo4j
   */
  async getOntologyRecommendations(profile: UserProfile): Promise<OntologyJobMatch[]> {
    console.log(`\n🧠 ONTOLOGY RECOMMENDATION ENGINE STARTED (Neo4j Powered)`);
    console.log(`🎯 Analyzing profile: ${profile.name} - ${profile.currentRole}`);

    try {
      const results = await this.neo4jService.findRecommendations(profile);

      // Map Neo4j results to expected interface
      return results.map(rec => ({
        ...rec,
        cultureMatchScore: 0, // Placeholder as culture logic is simplified in this version
        companySize: 'Unknown', // Not fetched in current query
        benefits: []
      }));
    } catch (error) {
      console.error('Failed to get recommendations from Neo4j:', error);
      // Fallback or rethrow? For now rethrow to make it visible
      throw error;
    }
  }
}