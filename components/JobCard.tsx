import React from 'react';
import { JobMatch } from '../types';
import './JobCard.css';

interface JobCardProps {
  job: JobMatch;
  rank: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, rank }) => {
  const getMatchScoreClass = (score: number) => {
    if (score >= 3.0) return 'high';
    if (score >= 1.5) return 'medium';
    return 'low';
  };

  const getMatchColor = (score: number) => {
    if (score >= 3.0) return '#10b981'; // green-500
    if (score >= 1.5) return '#facc15'; // yellow-400
    return '#ef4444'; // red-500
  };

  return (
    <div className="job-card">
      <div className="job-header">
        <div className="job-info-header">
          <div className="rank-wrapper">
            <span className="rank-badge">
              #{rank}
            </span>
            <h3 className="job-title">{job.title}</h3>
          </div>
          <p className="company-name">{job.company}</p>
          <p className="job-location">{job.location}</p>
        </div>
        <div className="match-score-wrapper">
          <div className="match-score-container">
            <span className={`match-percentage ${getMatchScoreClass(job.matchScore)}`}>
              {(job.matchScore).toFixed(1)} Pts
            </span>
            <div className="match-ring-outer">
              <div
                className="match-ring-inner"
                style={{
                  background: `conic-gradient(${getMatchColor(job.matchScore)} ${Math.min(360, (job.matchScore / 4.0) * 360)}deg, #f1f5f9 0deg)`
                }}
              >
                <div className="match-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="job-description">
        {job.jobDetail ? (
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-slate-700 mb-1">Role Description</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{job.jobDetail}</p>
          </div>
        ) : (
          <p>{job.description}</p>
        )}

        {job.jobProperties && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-slate-700 mb-1">Requirements & Properties</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{job.jobProperties}</p>
          </div>
        )}

        {job.companyDetail && (
          <div className="mb-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-sm text-slate-700 mb-1">About {job.company}</h4>
            <p className="text-sm text-slate-600 line-clamp-3 hover:line-clamp-none transition-all">{job.companyDetail}</p>
            {job.companyAddress && (
              <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.companyAddress}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="job-details-grid">
        <div>
          <span className="detail-label">Salary Range</span>
          <p className="detail-value">{job.salaryRange}</p>
        </div>
        <div>
          <span className="detail-label">Type</span>
          <p className="detail-value">{job.workStyle.join(', ')}</p>
        </div>
        <div>
          <span className="detail-label">Industry</span>
          <p className="detail-value">{job.industry}</p>
        </div>
        <div>
          <span className="detail-label">Experience Match</span>
          <p className={`detail-value ${job.experienceMatch ? 'qualified' : 'close-match'}`}>
            {job.experienceMatch ? '✓ Qualified' : '⚠ Close Match'}
          </p>
        </div>
        {job.companySize && (
          <div>
            <span className="detail-label">Company Size</span>
            <p className="detail-value">{job.companySize}</p>
          </div>
        )}
      </div>

      {job.matchReasons.length > 0 && (
        <div className="match-reasons">
          <span className="match-reasons-title">Why This Matches</span>
          <ul className="match-reasons-list">
            {job.matchReasons.map((reason, index) => (
              <li key={index} className="match-reason-item">
                <span className="success-bullet">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="job-footer">
        <div className="job-footer-section">
          <span className="detail-label">Required Skills</span>
          <div className="tags-wrapper">
            {job.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="skill-tag"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {job.benefits && job.benefits.length > 0 && (
          <div className="job-footer-section">
            <span className="detail-label">Benefits</span>
            <div className="tags-wrapper">
              {job.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="benefit-tag"
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