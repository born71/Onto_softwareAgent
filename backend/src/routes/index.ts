import { Router } from 'express';
import profileRoutes from './profile.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import jobRoutes from './job.routes.js';

const router = Router();

router.use('/profile', profileRoutes);
router.use('/recommendations', recommendationRoutes);
// Keep the path /smart-recommendations mapping to the unified controller so frontend doesn't break
router.use('/smart-recommendations', recommendationRoutes);
router.use('/jobs', jobRoutes);

export default router;
