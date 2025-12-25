import React from 'react';
import { JobMatch } from '../types';
import './JobCard.css';

interface JobCardProps {
  job: JobMatch;
  rank: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, rank }) => {
  const getMatchScoreClass = (score: number) => {
    if (score >= 71) return 'high';
    if (score >= 26) return 'medium';
    return 'low';
  };

  const getMatchColor = (score: number) => {
    if (score >= 71) return '#10b981'; // green-500
    if (score >= 26) return '#facc15'; // yellow-400
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
              {(job.matchScore).toFixed(2)}%
            </span>
            <div className="match-ring-outer">
              <div
                className="match-ring-inner"
                style={{
                  background: `conic-gradient(${getMatchColor(job.matchScore)} ${job.matchScore * 3.6}deg, #f1f5f9 0deg)`
                }}
              >
                <div className="match-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="job-description">
        <p>{job.description}</p>
      </div>

      <div className="job-details-grid">
        <div>
          <span className="detail-label">Salary Range</span>
          <p className="detail-value">{job.salaryRange}</p>
        </div>
        <div>
          <span className="detail-label">Work Style</span>
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