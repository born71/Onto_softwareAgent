import { UserProfile, RecommendationsResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const profileApi = {
  // Get all profiles
  async getAll(): Promise<UserProfile[]> {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }
    return response.json();
  },

  // Get profile by ID
  async getById(id: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  },

  // Create a new profile
  async create(profile: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to create profile');
    }
    return response.json();
  },

  // Update a profile
  async update(id: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return response.json();
  },

  // Delete a profile
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/profile/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }
  },
};

export const recommendationApi = {
  // Get job recommendations for a profile (original rule-based)
  async getRecommendations(profile: UserProfile): Promise<RecommendationsResponse> {
    const response = await fetch(`${API_BASE_URL}/recommendations/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }
    return response.json();
  },

  // Rule-based recommendations
  async getRuleBased(profile: UserProfile): Promise<RecommendationsResponse> {
    const response = await fetch(`${API_BASE_URL}/smart-recommendations/rule-based`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to get rule-based recommendations');
    }
    return response.json();
  },

  // Ontology-based recommendations
  async getOntologyBased(profile: UserProfile): Promise<RecommendationsResponse> {
    const response = await fetch(`${API_BASE_URL}/smart-recommendations/ontology-based`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to get ontology recommendations');
    }
    return response.json();
  },

  // Hybrid recommendations
  async getHybrid(profile: UserProfile): Promise<RecommendationsResponse> {
    const response = await fetch(`${API_BASE_URL}/smart-recommendations/hybrid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to get hybrid recommendations');
    }
    return response.json();
  },

  // Compare all approaches
  async getComparison(profile: UserProfile): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/smart-recommendations/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to get comparison results');
    }
    return response.json();
  },
};
