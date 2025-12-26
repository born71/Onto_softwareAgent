import React, { useState } from 'react';
import { JobMatch } from '../types';
import './MatchCard.css';

interface MatchCardProps {
  job: JobMatch;
  rank: number;
}

const MatchCard: React.FC<MatchCardProps> = ({ job, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine color based on match score
  // Keeping these as they are dynamically used for SVGs and text colors which might be better as utilities or dynamic classes.
  // However, I will map them to the CSS classes I created where possible or keep as inline styles if needed for the SVG stroke.
  // Since I created specific classes like .score-emerald in CSS, I can try to use them, but the logic below returns Tailwind strings.
  // I'll update the logic to return clean class names that match my CSS.

  const getScoreColor = (score: number) => {
    // These seem to be used for the ring color in previous code, but actually there are two functions: getScoreColor and getRingColor.
    // getScoreColor was used for... wait, looking at original code:
    // It was NOT used in the JSX I saw earlier! It was defined but unused?
    // Ah, line 100: classname is just text-slate-700.
    // Let me re-read the original file content.
    // original line 100: <div className="... text-slate-700">...</div>
    // line 13-18 definition of getScoreColor.
    // I don't see it being used in the returned JSX in the previous `view_file` output.
    // Wait, let me check carefully.
    // It might have been mapped to something else? 
    // I will keep the functions but update them to return my new CSS classes if they correspond to the dynamic parts.
    // Actually, getRingColor IS used at line 92: `${getRingColor(job.matchScore)} ...`

    // Let's redefine these helpers to return keys or specific classes.
    // But for the SVG stroke, it expects a class that sets the stroke color.
    // In my CSS I added .score-circle-fg.score-emerald etc.
    // So I will return 'score-emerald', 'score-indigo', etc.
    if (score >= 90) return 'score-emerald';
    if (score >= 80) return 'score-indigo';
    if (score >= 70) return 'score-amber';
    return 'score-slate';
  };

  const getRingColor = (score: number) => {
    // This previously returned 'stroke-emerald-500' etc.
    // My CSS classes are like .score-circle-fg.score-emerald { stroke: ... }
    // So I can reuse the logic above.
    return getScoreColor(score);
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (job.matchScore / 100) * circumference;

  return (
    <div className="match-card">
      {/* Summary Header (Always visible) */}
      <div
        className="match-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="match-header-content">
          <div className="match-info-container">
            {/* Rank Badge */}
            <div className="rank-badge">
              #{rank}
            </div>

            <div>
              <h3 className="match-title">{job.title}</h3>
              <p className="match-company">{job.company}</p>
              <div className="match-meta">
                <span className="match-meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="match-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="match-separator"></span>
                <span className="match-meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="match-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salaryRange}
                </span>
                {job.companySize && (
                  <>
                    <span className="match-separator"></span>
                    <span className="match-meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" className="match-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.companySize}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="score-container">
            <div className="score-chart">
              <svg className="score-svg">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className="score-circle-bg"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className={`score-circle-fg ${getRingColor(job.matchScore)}`}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="score-text">
                {(job.matchScore).toFixed(2)}%
              </div>
            </div>
            <span className="score-label">Match</span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="expanded-details">
          <div className="details-grid">
            <div className="details-column">
              <div>
                <h4 className="section-title">Job Description</h4>
                <p className="description-text">{job.description}</p>
              </div>

              {job.matchReasons.length > 0 && (
                <div>
                  <h4 className="section-title">Why It's a Match</h4>
                  <ul className="reasons-list">
                    {job.matchReasons.map((reason, idx) => (
                      <li key={idx} className="reason-item">
                        <span className="reason-bullet">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="experience-match">
                <span className="experience-label">Experience Match:</span>
                <span className={`experience-badge ${job.experienceMatch ? 'qualified' : 'close'}`}>
                  {job.experienceMatch ? '✓ Qualified' : '⚠ Close Match'}
                </span>
              </div>
            </div>

            <div className="details-column">
              <div>
                <h4 className="section-title">Required Skills</h4>
                <div className="tags-container">
                  {job.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="section-title">Work Style</h4>
                <div className="tags-container">
                  {job.workStyle.map((style, idx) => (
                    <span key={idx} className="work-style-tag">
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="section-title">Benefits</h4>
                  <div className="tags-container">
                    {job.benefits.slice(0, 4).map((benefit, idx) => (
                      <span key={idx} className="benefit-tag">
                        {benefit}
                      </span>
                    ))}
                    {job.benefits.length > 4 && (
                      <span className="more-tag">
                        +{job.benefits.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="card-actions">
                <button className="view-btn">
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expand Toggle Indication */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="expand-toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
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