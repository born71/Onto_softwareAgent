import { Router } from 'express';
import profileRoutes from './profile.routes.js';

const router = Router();

router.use('/profile', profileRoutes);

export default router;
