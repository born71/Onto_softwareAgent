import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller.js';
import { HybridRecommendationController } from '../controllers/hybrid-recommendation.controller.js';

const router = Router();
const recommendationController = new RecommendationController();
const hybridController = new HybridRecommendationController();

// Original rule-based endpoint (backward compatibility)
router.post('/match', recommendationController.getRecommendations);

// New endpoints for different approaches
router.post('/rule-based', hybridController.getRuleBased);
router.post('/ontology-based', hybridController.getOntologyBased);
router.post('/hybrid', hybridController.getHybrid);
router.post('/compare', hybridController.getComparison);

export default router;