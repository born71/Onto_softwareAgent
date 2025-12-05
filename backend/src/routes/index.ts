import { Router } from 'express';
import profileRoutes from './profile.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import hybridRecommendationRoutes from './hybrid-recommendation.routes.js';
import jobRoutes from './job.routes.js';

const router = Router();

router.use('/profile', profileRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/smart-recommendations', hybridRecommendationRoutes);
router.use('/jobs', jobRoutes);

export default router;
