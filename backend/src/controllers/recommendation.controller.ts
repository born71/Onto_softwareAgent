import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service.js';

const recommendationService = new RecommendationService();

export class RecommendationController {
  async getRecommendations(req: Request, res: Response) {
    try {
      const profile = req.body;
      
      // Basic validation
      if (!profile.skills || !Array.isArray(profile.skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
      }
      
      if (typeof profile.yearsOfExperience !== 'number') {
        return res.status(400).json({ error: 'Years of experience must be a number' });
      }

      const recommendations = await recommendationService.getRecommendations(profile);
      
      res.json({
        recommendations,
        totalCount: recommendations.length,
        profile: {
          name: profile.name,
          currentRole: profile.currentRole
        }
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }
}