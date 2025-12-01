import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service.js';
import { OntologyRecommendationService } from '../services/ontology-recommendation.service.js';

const recommendationService = new RecommendationService();
const ontologyService = new OntologyRecommendationService();

export class HybridRecommendationController {
  
  // Original rule-based recommendations
  async getRuleBased(req: Request, res: Response) {
    try {
      const profile = req.body;
      
      // Basic validation
      if (!profile.skills || !Array.isArray(profile.skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
      }
      
      if (typeof profile.yearsOfExperience !== 'number') {
        return res.status(400).json({ error: 'Years of experience must be a number' });
      }

      console.log('\n🔧 RULE-BASED RECOMMENDATION ENGINE');
      const recommendations = await recommendationService.getRecommendations(profile);
      
      res.json({
        type: 'rule-based',
        recommendations,
        totalCount: recommendations.length,
        profile: {
          name: profile.name,
          currentRole: profile.currentRole
        },
        algorithm: {
          name: 'Rule-Based Weighted Scoring',
          weights: {
            skills: '40%',
            experience: '30%',
            industry: '20%',
            workStyle: '10%'
          }
        }
      });
    } catch (error) {
      console.error('Error getting rule-based recommendations:', error);
      res.status(500).json({ error: 'Failed to get rule-based recommendations' });
    }
  }

  // New ontology-based recommendations
  async getOntologyBased(req: Request, res: Response) {
    try {
      const profile = req.body;
      
      // Basic validation
      if (!profile.skills || !Array.isArray(profile.skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
      }
      
      if (typeof profile.yearsOfExperience !== 'number') {
        return res.status(400).json({ error: 'Years of experience must be a number' });
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
        algorithm: {
          name: 'Ontology-Based Semantic Matching',
          weights: {
            semanticSkills: '50%',
            experience: '25%',
            industry: '15%',
            culture: '10%'
          },
          features: [
            'Semantic skill relationships',
            'Industry knowledge graphs', 
            'Company culture matching',
            'Role transferability analysis'
          ]
        }
      });
    } catch (error) {
      console.error('Error getting ontology recommendations:', error);
      res.status(500).json({ error: 'Failed to get ontology recommendations' });
    }
  }

  // Hybrid approach - combines both methods
  async getHybrid(req: Request, res: Response) {
    try {
      const profile = req.body;
      
      // Basic validation
      if (!profile.skills || !Array.isArray(profile.skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
      }
      
      if (typeof profile.yearsOfExperience !== 'number') {
        return res.status(400).json({ error: 'Years of experience must be a number' });
      }

      console.log('\n🔀 HYBRID RECOMMENDATION ENGINE - Running both approaches');
      
      // Run both algorithms
      const [ruleBasedResults, ontologyResults] = await Promise.all([
        recommendationService.getRecommendations(profile),
        ontologyService.getOntologyRecommendations(profile)
      ]);

      // Combine and rank results
      const hybridResults = this.combineResults(ruleBasedResults, ontologyResults);
      
      res.json({
        type: 'hybrid',
        recommendations: hybridResults,
        totalCount: hybridResults.length,
        profile: {
          name: profile.name,
          currentRole: profile.currentRole
        },
        algorithm: {
          name: 'Hybrid Rule-Based + Ontology Matching',
          description: 'Combines traditional weighted scoring with semantic analysis'
        },
        breakdown: {
          ruleBasedCount: ruleBasedResults.length,
          ontologyCount: ontologyResults.length,
          combinedCount: hybridResults.length
        }
      });
    } catch (error) {
      console.error('Error getting hybrid recommendations:', error);
      res.status(500).json({ error: 'Failed to get hybrid recommendations' });
    }
  }

  // Compare all three approaches side by side
  async getComparison(req: Request, res: Response) {
    try {
      const profile = req.body;
      
      // Basic validation
      if (!profile.skills || !Array.isArray(profile.skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
      }
      
      if (typeof profile.yearsOfExperience !== 'number') {
        return res.status(400).json({ error: 'Years of experience must be a number' });
      }

      console.log('\n📊 ALGORITHM COMPARISON - Running all approaches');
      
      // Run all algorithms
      const [ruleBasedResults, ontologyResults] = await Promise.all([
        recommendationService.getRecommendations(profile),
        ontologyService.getOntologyRecommendations(profile)
      ]);

      const hybridResults = this.combineResults(ruleBasedResults, ontologyResults);
      
      res.json({
        type: 'comparison',
        profile: {
          name: profile.name,
          currentRole: profile.currentRole
        },
        results: {
          ruleBased: {
            algorithm: 'Rule-Based Weighted Scoring',
            count: ruleBasedResults.length,
            recommendations: ruleBasedResults.slice(0, 5), // Top 5
            weights: { skills: '40%', experience: '30%', industry: '20%', workStyle: '10%' }
          },
          ontologyBased: {
            algorithm: 'Ontology-Based Semantic Matching',
            count: ontologyResults.length,
            recommendations: ontologyResults.slice(0, 5), // Top 5
            weights: { semanticSkills: '50%', experience: '25%', industry: '15%', culture: '10%' }
          },
          hybrid: {
            algorithm: 'Hybrid Approach',
            count: hybridResults.length,
            recommendations: hybridResults.slice(0, 5), // Top 5
            description: 'Combines both algorithms for comprehensive matching'
          }
        }
      });
    } catch (error) {
      console.error('Error getting comparison results:', error);
      res.status(500).json({ error: 'Failed to get comparison results' });
    }
  }

  private combineResults(ruleBasedResults: any[], ontologyResults: any[]): any[] {
    const combinedMap = new Map();
    
    // Add rule-based results
    ruleBasedResults.forEach(job => {
      combinedMap.set(job.id, {
        ...job,
        ruleBasedScore: job.matchScore,
        ontologyScore: 0,
        approaches: ['rule-based']
      });
    });
    
    // Add or merge ontology results
    ontologyResults.forEach(job => {
      if (combinedMap.has(job.id)) {
        const existing = combinedMap.get(job.id);
        combinedMap.set(job.id, {
          ...existing,
          ontologyScore: job.matchScore,
          skillSemanticScore: job.skillSemanticScore,
          cultureMatchScore: job.cultureMatchScore,
          ontologyReasons: job.ontologyReasons,
          approaches: ['rule-based', 'ontology'],
          // Hybrid score: average of both approaches
          matchScore: Math.round((existing.ruleBasedScore + job.matchScore) / 2)
        });
      } else {
        combinedMap.set(job.id, {
          ...job,
          ruleBasedScore: 0,
          ontologyScore: job.matchScore,
          approaches: ['ontology']
        });
      }
    });
    
    // Convert to array and sort by hybrid score
    return Array.from(combinedMap.values())
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }
}