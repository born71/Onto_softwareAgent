// Mock corporate hiring data - realistic companies and positions
export const mockJobs = [
  // Big Tech Companies
  {
    id: '1',
    title: 'Software Engineer II',
    company: 'Google',
    location: 'Mountain View, CA',
    salaryRange: '$140k - $180k',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'System Design'],
    requiredExperience: 2,
    industry: 'Technology',
    workStyle: ['Hybrid', 'On-site'],
    description: 'Build and maintain large-scale web applications used by millions of users worldwide',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', '401k Matching', 'Stock Options', 'Free Meals']
  },
  {
    id: '2',
    title: 'Frontend Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salaryRange: '$130k - $170k',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'GraphQL', 'CSS'],
    requiredExperience: 3,
    industry: 'Technology',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Develop user interfaces for Facebook, Instagram, and WhatsApp platforms',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', 'RSUs', 'Wellness Programs', 'Remote Work Stipend']
  },
  {
    id: '3',
    title: 'Senior Software Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    salaryRange: '$150k - $200k',
    requiredSkills: ['Java', 'Python', 'AWS', 'Microservices', 'System Design', 'SQL'],
    requiredExperience: 5,
    industry: 'Technology',
    workStyle: ['Hybrid'],
    description: 'Design and implement scalable distributed systems for AWS services',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Career Development', 'Relocation Assistance']
  },
  {
    id: '4',
    title: 'ML Engineer',
    company: 'Microsoft',
    location: 'Redmond, WA',
    salaryRange: '$135k - $175k',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Azure', 'PyTorch', 'SQL'],
    requiredExperience: 4,
    industry: 'Technology',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Develop AI/ML solutions for Microsoft Azure and Office 365',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', 'Stock Purchase Plan', 'Learning Budget', 'Flexible PTO']
  },

  // Fintech Companies
  {
    id: '5',
    title: 'Backend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salaryRange: '$145k - $185k',
    requiredSkills: ['Ruby', 'Go', 'PostgreSQL', 'Kubernetes', 'APIs', 'Payment Systems'],
    requiredExperience: 3,
    industry: 'Fintech',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Build and scale payment infrastructure for internet businesses',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Equity', '$1000 Learning Budget', 'Home Office Setup']
  },
  {
    id: '6',
    title: 'Full Stack Developer',
    company: 'Coinbase',
    location: 'Remote (US)',
    salaryRange: '$120k - $160k',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Blockchain', 'AWS'],
    requiredExperience: 2,
    industry: 'Fintech',
    workStyle: ['Remote'],
    description: 'Develop cryptocurrency trading and wallet applications',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Crypto Bonus', 'Remote First', 'Professional Development']
  },
  {
    id: '7',
    title: 'Senior Data Engineer',
    company: 'Robinhood',
    location: 'Menlo Park, CA',
    salaryRange: '$140k - $180k',
    requiredSkills: ['Python', 'Spark', 'Kafka', 'AWS', 'SQL', 'Data Pipelines'],
    requiredExperience: 5,
    industry: 'Fintech',
    workStyle: ['Hybrid'],
    description: 'Build data infrastructure for real-time trading and analytics',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Stock Options', 'Commuter Benefits', 'Gym Membership']
  },

  // E-commerce & Marketplace
  {
    id: '8',
    title: 'Software Engineer',
    company: 'Shopify',
    location: 'Ottawa, Canada',
    salaryRange: '$95k - $125k',
    requiredSkills: ['Ruby on Rails', 'JavaScript', 'React', 'GraphQL', 'PostgreSQL'],
    requiredExperience: 2,
    industry: 'E-commerce',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Develop e-commerce platform features for millions of merchants',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Learning Stipend', 'Flexible Work']
  },
  {
    id: '9',
    title: 'DevOps Engineer',
    company: 'Etsy',
    location: 'Brooklyn, NY',
    salaryRange: '$110k - $145k',
    requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Python'],
    requiredExperience: 3,
    industry: 'E-commerce',
    workStyle: ['Hybrid'],
    description: 'Manage infrastructure and deployment for marketplace platform',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Craft Supplies Budget', 'Sabbatical Program', 'Pet Insurance']
  },

  // Streaming & Entertainment
  {
    id: '10',
    title: 'Senior Frontend Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salaryRange: '$160k - $210k',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'A/B Testing', 'Performance'],
    requiredExperience: 5,
    industry: 'Entertainment',
    workStyle: ['Hybrid'],
    description: 'Build streaming experiences for 200M+ subscribers worldwide',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Unlimited PTO', 'Content Budget']
  },
  {
    id: '11',
    title: 'Data Scientist',
    company: 'Spotify',
    location: 'New York, NY',
    salaryRange: '$125k - $165k',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Spark', 'TensorFlow', 'Statistics'],
    requiredExperience: 3,
    industry: 'Entertainment',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Develop recommendation algorithms and analyze user listening patterns',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Spotify Premium', 'Wellness Programs', 'Parental Leave']
  },

  // Cloud & Infrastructure
  {
    id: '12',
    title: 'Cloud Engineer',
    company: 'Databricks',
    location: 'San Francisco, CA',
    salaryRange: '$140k - $180k',
    requiredSkills: ['Python', 'Scala', 'Apache Spark', 'Kubernetes', 'AWS', 'Data Engineering'],
    requiredExperience: 3,
    industry: 'Technology',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Build unified analytics platform for big data and machine learning',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Equity', 'Learning Budget', 'Flexible Work']
  },
  {
    id: '13',
    title: 'Platform Engineer',
    company: 'Snowflake',
    location: 'San Mateo, CA',
    salaryRange: '$150k - $190k',
    requiredSkills: ['Go', 'Java', 'Kubernetes', 'Docker', 'Cloud Architecture', 'Distributed Systems'],
    requiredExperience: 4,
    industry: 'Technology',
    workStyle: ['Hybrid'],
    description: 'Develop cloud data platform infrastructure and services',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Stock Options', 'Ski Pass', 'Professional Development']
  },

  // Cybersecurity
  {
    id: '14',
    title: 'Security Engineer',
    company: 'CrowdStrike',
    location: 'Austin, TX',
    salaryRange: '$130k - $170k',
    requiredSkills: ['Python', 'Go', 'Cybersecurity', 'AWS', 'Linux', 'Threat Detection'],
    requiredExperience: 3,
    industry: 'Cybersecurity',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Develop endpoint protection and threat intelligence systems',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Security Training', 'Home Office Budget']
  },
  {
    id: '15',
    title: 'Software Engineer - Security',
    company: 'Palo Alto Networks',
    location: 'Santa Clara, CA',
    salaryRange: '$125k - $165k',
    requiredSkills: ['C++', 'Python', 'Network Security', 'Firewalls', 'Linux', 'Threat Analysis'],
    requiredExperience: 2,
    industry: 'Cybersecurity',
    workStyle: ['Hybrid'],
    description: 'Build next-generation firewall and security products',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', 'RSUs', 'Wellness Programs', 'Tuition Reimbursement']
  },

  // Healthcare Tech
  {
    id: '16',
    title: 'Senior Full Stack Engineer',
    company: 'Teladoc Health',
    location: 'Purchase, NY',
    salaryRange: '$120k - $155k',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Healthcare APIs', 'HIPAA'],
    requiredExperience: 4,
    industry: 'Healthcare',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Develop telehealth platform connecting patients with healthcare providers',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Telehealth Benefits', 'Flexible PTO']
  },
  {
    id: '17',
    title: 'Mobile Developer',
    company: 'Epic Systems',
    location: 'Verona, WI',
    salaryRange: '$85k - $120k',
    requiredSkills: ['iOS', 'Android', 'Swift', 'Kotlin', 'Healthcare', 'FHIR'],
    requiredExperience: 2,
    industry: 'Healthcare',
    workStyle: ['On-site'],
    description: 'Build mobile applications for electronic health records',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', 'Campus Amenities', 'Training Programs', 'Relocation Package']
  },

  // Enterprise Software
  {
    id: '18',
    title: 'Software Engineer',
    company: 'Salesforce',
    location: 'San Francisco, CA',
    salaryRange: '$130k - $165k',
    requiredSkills: ['Java', 'JavaScript', 'Salesforce Platform', 'Apex', 'Lightning', 'SQL'],
    requiredExperience: 2,
    industry: 'Enterprise Software',
    workStyle: ['Hybrid'],
    description: 'Develop CRM platform features and integrations',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Volunteer Time Off', 'Wellbeing Programs']
  },
  {
    id: '19',
    title: 'DevOps Engineer',
    company: 'Atlassian',
    location: 'Austin, TX',
    salaryRange: '$115k - $150k',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Python'],
    requiredExperience: 3,
    industry: 'Enterprise Software',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Manage infrastructure for Jira, Confluence, and Bitbucket',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Equity', 'Learning Budget', 'Team Building Events']
  },

  // Transportation & Logistics
  {
    id: '20',
    title: 'Backend Engineer',
    company: 'Uber',
    location: 'San Francisco, CA',
    salaryRange: '$140k - $180k',
    requiredSkills: ['Go', 'Java', 'Microservices', 'Kafka', 'Redis', 'PostgreSQL'],
    requiredExperience: 3,
    industry: 'Transportation',
    workStyle: ['Hybrid'],
    description: 'Build real-time matching and routing systems for rideshare platform',
    companySize: 'Large (10000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Uber Credits', 'Meals']
  },
  {
    id: '21',
    title: 'Machine Learning Engineer',
    company: 'Lyft',
    location: 'San Francisco, CA',
    salaryRange: '$135k - $175k',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'AWS', 'Spark', 'MLOps'],
    requiredExperience: 4,
    industry: 'Transportation',
    workStyle: ['Hybrid'],
    description: 'Develop ML models for pricing, ETA prediction, and fraud detection',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Equity', 'Lyft Credits', 'Professional Development']
  },

  // Social Media & Communication
  {
    id: '22',
    title: 'iOS Engineer',
    company: 'Discord',
    location: 'San Francisco, CA',
    salaryRange: '$130k - $170k',
    requiredSkills: ['iOS', 'Swift', 'Objective-C', 'Real-time Systems', 'WebRTC'],
    requiredExperience: 3,
    industry: 'Social Media',
    workStyle: ['Remote', 'Hybrid'],
    description: 'Build iOS app for voice, video, and text communication',
    companySize: 'Medium (500-1000)',
    benefits: ['Health Insurance', 'Equity', 'Gaming Budget', 'Remote Work Stipend']
  },
  {
    id: '23',
    title: 'Infrastructure Engineer',
    company: 'Twitter',
    location: 'San Francisco, CA',
    salaryRange: '$145k - $185k',
    requiredSkills: ['Scala', 'Java', 'Kubernetes', 'Kafka', 'Redis', 'Distributed Systems'],
    requiredExperience: 4,
    industry: 'Social Media',
    workStyle: ['Hybrid'],
    description: 'Scale infrastructure to handle billions of tweets and real-time updates',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Free Meals', 'Wellness Programs']
  },

  // Gaming
  {
    id: '24',
    title: 'Game Engine Developer',
    company: 'Unity Technologies',
    location: 'Austin, TX',
    salaryRange: '$110k - $150k',
    requiredSkills: ['C++', 'C#', 'Unity', 'Graphics Programming', 'Game Development', 'OpenGL'],
    requiredExperience: 3,
    industry: 'Gaming',
    workStyle: ['Hybrid'],
    description: 'Develop Unity game engine features and performance optimizations',
    companySize: 'Large (5000+)',
    benefits: ['Health Insurance', 'Stock Options', 'Game Budget', 'Creative Time']
  },
  {
    id: '25',
    title: 'Senior Software Engineer',
    company: 'Roblox',
    location: 'San Mateo, CA',
    salaryRange: '$155k - $195k',
    requiredSkills: ['C++', 'Lua', 'Distributed Systems', 'Game Development', 'Scalability'],
    requiredExperience: 5,
    industry: 'Gaming',
    workStyle: ['Hybrid'],
    description: 'Build platform infrastructure for millions of user-generated games',
    companySize: 'Large (1000-5000)',
    benefits: ['Health Insurance', 'Equity', 'Roblox Credits', 'Innovation Time']
  }
];