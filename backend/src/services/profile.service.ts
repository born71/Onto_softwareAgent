import { UserProfile } from '../types/index.js';

// In-memory storage for now (can be replaced with database later)
const profiles: Map<string, UserProfile> = new Map();

export class ProfileService {
  async getAll(): Promise<UserProfile[]> {
    return Array.from(profiles.values());
  }

  async getById(id: string): Promise<UserProfile | undefined> {
    return profiles.get(id);
  }

  async create(data: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const id = crypto.randomUUID();
    const profile: UserProfile = { id, ...data };
    profiles.set(id, profile);
    return profile;
  }

  async update(id: string, data: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const existing = profiles.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: UserProfile = { ...existing, ...data, id };
    profiles.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return profiles.delete(id);
  }
}
