import React, { useState } from 'react';
import ProfileForm from './components/ProfileForm';
import MatchCard from './components/MatchCard';
import { getCareerMatches } from './services/geminiService';
import { UserProfile, JobRecommendation } from './types';

function App() {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setRecommendations([]);

    try {
      const data = await getCareerMatches(profile);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      setError("Unable to generate matches. Please check your API key and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
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
            Powered by Gemini 2.5
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

          {/* Right Column: Output */}
          <div className="w-full lg:w-2/3">
             {!hasSearched && (
               <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-60">
                  <div className="w-64 h-64 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">Ready to Match?</h3>
                  <p className="text-slate-500 max-w-md">
                    Fill out your profile on the left to let our AI analyze your skills and find top corporate opportunities tailored for you.
                  </p>
               </div>
             )}

             {isLoading && (
               <div className="space-y-4 py-8">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-pulse">
                     <div className="flex justify-between items-start mb-4">
                       <div className="space-y-3 w-2/3">
                         <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                         <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                       </div>
                       <div className="h-14 w-14 rounded-full bg-slate-200"></div>
                     </div>
                     <div className="space-y-2">
                       <div className="h-3 bg-slate-100 rounded w-full"></div>
                       <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                     </div>
                   </div>
                 ))}
               </div>
             )}

             {error && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mt-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
               </div>
             )}

             {recommendations.length > 0 && !isLoading && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-2xl font-bold text-slate-800">Recommended Opportunities</h2>
                     <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                       {recommendations.length} Matches Found
                     </span>
                  </div>
                  
                  {recommendations.map((job, index) => (
                    <MatchCard key={index} job={job} rank={index + 1} />
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