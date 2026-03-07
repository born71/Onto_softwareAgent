import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller.js';

const router = Router();
const recommendationController = new RecommendationController();

// Core ontology-based recommendation endpoints
router.post('/match', recommendationController.getRecommendations);
router.get('/jobs', recommendationController.getAllJobs);

export default router;