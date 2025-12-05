import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';

const router = Router();
const jobController = new JobController();

router.get('/', jobController.getAllJobs);

export default router;
