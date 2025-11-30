import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    currentRole: '',
    yearsOfExperience: 0,
    skills: [],
    preferredIndustry: 'Technology',
    workStyle: 'Hybrid',
    about: ''
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value
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
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Your Profile
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="e.g. Alex Johnson"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Job Title</label>
            <input
              type="text"
              name="currentRole"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="e.g. Frontend Developer"
              value={formData.currentRole}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              min="0"
              max="50"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Work Style</label>
             <select
                name="workStyle"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
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

        {/* Industry */}
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Target Industry</label>
           <input
             type="text"
             name="preferredIndustry"
             className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
             placeholder="e.g. Fintech, Healthcare, E-commerce"
             value={formData.preferredIndustry}
             onChange={handleInputChange}
           />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Skills & Tools</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="Add a skill (Press Enter)"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {formData.skills.map(skill => (
              <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && (
              <p className="text-sm text-slate-400 italic py-1">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary (Brief)</label>
          <textarea
            name="about"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none"
            placeholder="Briefly describe your background and what you are looking for..."
            value={formData.about}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading || formData.skills.length === 0}
          className={`w-full py-3 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 
            ${isLoading || formData.skills.length === 0
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : 'Find Career Matches'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;