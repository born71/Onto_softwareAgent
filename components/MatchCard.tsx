import React, { useState } from 'react';
import { JobMatch } from '../types';

interface MatchCardProps {
  job: JobMatch;
  rank: number;
}

const MatchCard: React.FC<MatchCardProps> = ({ job, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 80) return 'text-indigo-600 border-indigo-500 bg-indigo-50';
    if (score >= 70) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-slate-600 border-slate-500 bg-slate-50';
  };

  const getRingColor = (score: number) => {
    if (score >= 90) return 'stroke-emerald-500';
    if (score >= 80) return 'stroke-indigo-500';
    if (score >= 70) return 'stroke-amber-500';
    return 'stroke-slate-500';
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (job.matchScore / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4">
      {/* Summary Header (Always visible) */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {/* Rank Badge */}
            <div className="hidden md:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xl">
              #{rank}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">{job.title}</h3>
              <p className="text-slate-600 font-medium">{job.company}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salaryRange}
                </span>
                {job.companySize && (
                  <>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.companySize}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className="stroke-slate-200 fill-none"
                  strokeWidth="4"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className={`${getRingColor(job.matchScore)} fill-none transition-all duration-1000 ease-out`}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                {(job.matchScore).toFixed(2)}%
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase text-slate-400 mt-1">Match</span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/50 pt-4 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Job Description</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
              </div>

              {job.matchReasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Why It's a Match</h4>
                  <ul className="space-y-1">
                    {job.matchReasons.map((reason, idx) => (
                      <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Experience Match:</span>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${job.experienceMatch ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {job.experienceMatch ? '✓ Qualified' : '⚠ Close Match'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Work Style</h4>
                <div className="flex flex-wrap gap-2">
                  {job.workStyle.map((style, idx) => (
                    <span key={idx} className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.slice(0, 4).map((benefit, idx) => (
                      <span key={idx} className="bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                    {job.benefits.length > 4 && (
                      <span className="text-xs text-slate-500 px-2 py-1">
                        +{job.benefits.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expand Toggle Indication (Subtle) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`h-6 flex items-center justify-center bg-slate-50 border-t border-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default MatchCard;