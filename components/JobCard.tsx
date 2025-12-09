import React from 'react';
import { JobMatch } from '../types';

interface JobCardProps {
  job: JobMatch;
  rank: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, rank }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">
              #{rank}
            </span>
            <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
          </div>
          <p className="text-indigo-600 font-medium text-lg">{job.company}</p>
          <p className="text-slate-500">{job.location}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-2xl font-bold ${job.matchScore >= 71 ? 'text-green-600' :
              job.matchScore >= 26 ? 'text-yellow-500' : 'text-red-600'
              }`}>{(job.matchScore).toFixed(2)}%</span>
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-50">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  background: `conic-gradient(${job.matchScore >= 71 ? '#10b981' :
                    job.matchScore >= 26 ? '#facc15' : '#ef4444'
                    } ${job.matchScore * 3.6}deg, #f1f5f9 0deg)`
                }}
              >
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-600 text-sm">{job.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Salary Range</span>
          <p className="text-sm font-semibold text-slate-700">{job.salaryRange}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Work Style</span>
          <p className="text-sm font-semibold text-slate-700">{job.workStyle.join(', ')}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Industry</span>
          <p className="text-sm font-semibold text-slate-700">{job.industry}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Experience Match</span>
          <p className={`text-sm font-semibold ${job.experienceMatch ? 'text-green-600' : 'text-orange-600'}`}>
            {job.experienceMatch ? '✓ Qualified' : '⚠ Close Match'}
          </p>
        </div>
        {job.companySize && (
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Company Size</span>
            <p className="text-sm font-semibold text-slate-700">{job.companySize}</p>
          </div>
        )}
      </div>

      {job.matchReasons.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">Why This Matches</span>
          <ul className="space-y-1">
            {job.matchReasons.map((reason, index) => (
              <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t pt-4 space-y-4">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">Required Skills</span>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {job.benefits && job.benefits.length > 0 && (
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">Benefits</span>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-200"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;