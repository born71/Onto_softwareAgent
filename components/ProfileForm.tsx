import React, { useState } from 'react';
import { UserProfile } from '../types';
import './ProfileForm.css';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  onGetRecommendations: (profile: UserProfile) => void;
  onGetComparison?: (profile: UserProfile) => void;
  selectedAlgorithm?: string;
  onAlgorithmChange?: (algorithm: string) => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  onSubmit,
  onGetRecommendations,
  onGetComparison,
  selectedAlgorithm = 'ontology-based',
  onAlgorithmChange,
  isLoading
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    currentRole: '',
    yearsOfExperience: 0,
    skills: [],
    preferredIndustry: 'Technology',
    workStyle: 'Hybrid',
    expectedSalary: 100000,
    about: ''
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' || name === 'expectedSalary' ? parseInt(value) || 0 : value
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="profile-form-card">
      <h2 className="form-header">
        <svg xmlns="http://www.w3.org/2000/svg" className="header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="form-container">

        {/* Basic Info */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              placeholder="e.g. Alex Johnson"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Job Title</label>
            <input
              type="text"
              name="currentRole"
              required
              className="form-input"
              placeholder="e.g. Frontend Developer"
              value={formData.currentRole}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              min="0"
              max="50"
              required
              className="form-input"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Work Style</label>
            <select
              name="workStyle"
              className="form-select"
              value={formData.workStyle}
              onChange={handleInputChange}
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Any">Any</option>
            </select>
          </div>
        </div>


        {/* Salary Expectation */}
        <div className="form-group">
          <div className="salary-header">
            <label className="form-label" style={{ marginBottom: 0 }}>Expected Salary (Annual)</label>
            <span className="salary-value">
              ${formData.expectedSalary?.toLocaleString() || 0}+
            </span>
          </div>
          <input
            type="range"
            name="expectedSalary"
            min="0"
            max="300000"
            step="5000"
            className="salary-slider"
            value={formData.expectedSalary || 0}
            onChange={handleInputChange}
          />
          <div className="salary-labels">
            <span>$0</span>
            <span>$150k</span>
            <span>$300k+</span>
          </div>
        </div>

        {/* Industry */}
        <div className="form-group">
          <label className="form-label">Target Industry</label>
          <input
            type="text"
            name="preferredIndustry"
            className="form-input"
            placeholder="e.g. Fintech, Healthcare, E-commerce"
            value={formData.preferredIndustry}
            onChange={handleInputChange}
          />
        </div>

        {/* Skills */}
        <div className="form-group">
          <label className="form-label">Skills & Tools</label>
          <div className="input-group">
            <input
              type="text"
              className="form-input"
              placeholder="Add a skill (Press Enter)"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={addSkill}
              className="add-btn"
            >
              Add
            </button>
          </div>
          <div className="skills-list">
            {formData.skills.map(skill => (
              <span key={skill} className="skill-chip">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="remove-skill-btn"
                >
                  &times;
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && (
              <p className="no-skills-msg">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* About */}
        <div className="form-group">
          <label className="form-label">Professional Summary (Brief)</label>
          <textarea
            name="about"
            rows={3}
            className="form-textarea"
            placeholder="Briefly describe your background and what you are looking for..."
            value={formData.about}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="actions-container">
          <button
            type="submit"
            disabled={isLoading}
            className={`action-btn ${isLoading ? 'btn-disabled' : 'btn-save'}`}
          >
            {isLoading ? (
              <span className="btn-content">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Profile'}
          </button>

          <button
            type="button"
            onClick={() => onGetRecommendations(formData)}
            disabled={isLoading || formData.skills.length === 0}
            className={`action-btn ${isLoading || formData.skills.length === 0 ? 'btn-disabled' : 'btn-find'}`}
          >
            {isLoading ? (
              <span className="btn-content">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding Jobs...
              </span>
            ) : 'Find Jobs'}
          </button>
        </div>
      </form >
    </div >
  );
};

export default ProfileForm;