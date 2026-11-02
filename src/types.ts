export type Platform = 'LinkedIn' | 'Naukri' | 'Indeed';

export interface BaseResume {
  id: string;
  name: string;
  email: string;
  phone?: string;
  targetTitles: string[];
  rawText: string;
  fileName?: string;
  fileSize?: number;
  experienceYears: number;
  detectedSkills: string[];
  updatedAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  platform: Platform;
  location: string;
  url: string;
  jdText: string;
  addedAt: string;
  keyAlignmentHighlights?: string[];
  cachedScore?: number;
}

export interface ATSEvaluation {
  jobId: string;
  jobTitle: string;
  company: string;
  platform: Platform;
  overallScore: number;
  keywordScore: number;     // max 40
  experienceScore: number;  // max 30
  gapPenalty: number;       // max 30 deduction
  matchedKeywords: string[];
  missingKeywords: string[];
  verdict: 'Strong' | 'Needs Tailoring';
  alignmentHighlights: string[];
  seniorityAnalysis: string;
  gapAnalysis: string;
  evaluatedAt: string;
}

export interface BulletAdjustment {
  id: string;
  section: string;
  originalBullet: string;
  tailoredBullet: string;
  keywordAdded: string;
  rationale: string;
  impactScore: number;
  approved: boolean;
}

export interface TailorResponse {
  projectedScore: number;
  summaryOfChanges: string[];
  bulletAdjustments: BulletAdjustment[];
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  platform: Platform;
  location: string;
  url: string;
  atsScore: number;
  resumeVersion: 'Base Resume' | 'Tailored Resume';
  appliedAt: string;
  status: 'Submitted' | 'Interviewing' | 'Screening' | 'Archived';
  tailoredBulletsCount?: number;
}
