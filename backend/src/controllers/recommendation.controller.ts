import { Request, Response } from 'express';
import { OntologyRecommendationService } from '../services/ontology-recommendation.service.js';
import { Neo4jService } from '../services/neo4j.service.js';

const ontologyService = new OntologyRecommendationService();
const neo4jService = new Neo4jService();

export class RecommendationController {

  // Get all jobs from Neo4j
  async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await neo4jService.getAllJobs();
      res.json({ count: jobs.length, jobs });
    } catch (error) {
      console.error('Error getting all jobs:', error);
      res.status(500).json({ error: 'Failed to get jobs' });
    }
  }

  // Ontology-based recommendations
  async getRecommendations(req: Request, res: Response) {
    try {
      const profile = req.body;

      // Basic validation
      if (!profile.skills || !Array.isArray(profile.skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
      }

      const recommendations = await ontologyService.getOntologyRecommendations(profile);

      res.json({
        type: 'ontology-based',
        recommendations,
        totalCount: recommendations.length,
        profile: {
          name: profile.name,
          currentRole: profile.currentRole
        },
      });
    } catch (error) {
      console.error('Error getting ontology recommendations:', error);
      res.status(500).json({ error: 'Failed to get ontology recommendations' });
    }
  }
}