import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service.js';

const profileService = new ProfileService();

export class ProfileController {
  async getAll(req: Request, res: Response) {
    try {
      const profiles = await profileService.getAll();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profiles' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const profile = await profileService.getById(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const profile = await profileService.create(req.body);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create profile' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const profile = await profileService.update(req.params.id, req.body);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await profileService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete profile' });
    }
  }
}
