import React, { useState, useEffect } from 'react';
import ProfileForm from './components/ProfileForm';
import { profileApi } from './services/api';
import { UserProfile } from './types';

// Extended type to include id from backend
interface UserProfileWithId extends UserProfile {
  id?: string;
}

function App() {
  const [profiles, setProfiles] = useState<UserProfileWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await profileApi.getAll();
      setProfiles(data);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    }
  };

  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const savedProfile = await profileApi.create(profile);
      setProfiles(prev => [...prev, savedProfile]);
      setSuccessMessage('Profile saved successfully!');
    } catch (err: any) {
      setError("Unable to save profile. Please make sure the backend is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await profileApi.delete(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError("Failed to delete profile.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 rounded-lg p-1.5">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
             </div>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
               CareerSync AI
             </span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Profile Manager
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          
          {/* Left Column: Input */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24 h-fit">
             <ProfileForm onSubmit={handleProfileSubmit} isLoading={isLoading} />
          </div>

          {/* Right Column: Saved Profiles */}
          <div className="w-full lg:w-2/3">
             {successMessage && (
               <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                  <span className="block sm:inline">{successMessage}</span>
               </div>
             )}

             {error && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
               </div>
             )}

             {isLoading && (
               <div className="space-y-4 py-8">
                 <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-pulse">
                   <div className="flex justify-between items-start mb-4">
                     <div className="space-y-3 w-2/3">
                       <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                       <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {profiles.length === 0 && !isLoading && (
               <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-60">
                  <div className="w-64 h-64 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">No Profiles Yet</h3>
                  <p className="text-slate-500 max-w-md">
                    Fill out the form on the left to create your first profile.
                  </p>
               </div>
             )}

             {profiles.length > 0 && !isLoading && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-2xl font-bold text-slate-800">Saved Profiles</h2>
                     <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                       {profiles.length} Profile{profiles.length !== 1 ? 's' : ''}
                     </span>
                  </div>
                  
                  {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
                          <p className="text-indigo-600 font-medium">{profile.currentRole}</p>
                        </div>
                        <button
                          onClick={() => profile.id && handleDeleteProfile(profile.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Delete profile"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p><span className="font-medium">Experience:</span> {profile.yearsOfExperience} years</p>
                        <p><span className="font-medium">Industry:</span> {profile.preferredIndustry}</p>
                        <p><span className="font-medium">Work Style:</span> {profile.workStyle}</p>
                        {profile.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {profile.skills.map((skill, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        {profile.about && (
                          <p className="mt-3 text-slate-500 italic">"{profile.about}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;