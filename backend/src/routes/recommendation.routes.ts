import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller.js';

const router = Router();
const recommendationController = new RecommendationController();

router.post('/match', recommendationController.getRecommendations);

export default router;