import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';

const router = Router();
const profileController = new ProfileController();

router.get('/', profileController.getAll);
router.get('/:id', profileController.getById);
router.post('/', profileController.create);
router.put('/:id', profileController.update);
router.delete('/:id', profileController.delete);

export default router;
