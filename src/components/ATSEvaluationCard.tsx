import React from 'react';
import { ATSEvaluation, JobPosting } from '../types';
import { CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, ChevronRight, BarChart3 } from 'lucide-react';

interface ATSEvaluationCardProps {
  evaluation: ATSEvaluation;
  selectedJob: JobPosting;
  threshold: number;
  onTriggerCaseA: () => void;
  onTriggerCaseB: () => void;
  onBackToJobs: () => void;
  isTailoringLoading: boolean;
}

export const ATSEvaluationCard: React.FC<ATSEvaluationCardProps> = ({
  evaluation,
  selectedJob,
  threshold,
  onTriggerCaseA,
  onTriggerCaseB,
  onBackToJobs,
  isTailoringLoading,
}) => {
  const isStrongMatch = evaluation.overallScore >= threshold;

  // Formula values
  const keywordScore = evaluation.keywordScore;
  const experienceScore = evaluation.experienceScore;
  const gapPenalty = evaluation.gapPenalty;

  // Circular gauge circumference
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (evaluation.overallScore / 100) * circumference;

  const scoreColor = isStrongMatch
    ? 'text-emerald-600 dark:text-emerald-400 stroke-emerald-600 dark:stroke-emerald-400'
    : 'text-amber-600 dark:text-amber-400 stroke-amber-500 dark:stroke-amber-400';

  return (
    <div className="space-y-8">
      {/* Breadcrumb / Step Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button onClick={onBackToJobs} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            Job Queue
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900 dark:text-white">
            ATS Evaluation
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 dark:text-slate-300">
            {selectedJob.company} ({selectedJob.title})
          </span>
        </div>

        <button
          onClick={onBackToJobs}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          ← Choose another opening
        </button>
      </div>

      {/* Hero Evaluation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-xs space-y-8">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {selectedJob.platform} Opening
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{selectedJob.location}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display mt-1">
              {selectedJob.title}
            </h1>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
              {selectedJob.company}
            </p>
          </div>

          {/* Verdict Banner */}
          <div className="flex items-center gap-4">
            {isStrongMatch ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">Verdict: Strong Match</div>
                  <div className="text-xs font-mono">Exceeds {threshold}% threshold</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">Verdict: Needs Tailoring</div>
                  <div className="text-xs font-mono">Below {threshold}% threshold</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score & Formula Gauge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular Score Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                {/* Background Track */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Value Stroke */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className={`transition-all duration-1000 ease-out ${scoreColor}`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {evaluation.overallScore}%
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  ATS Score
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Minimum Threshold: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{threshold}%</span>
              </div>
            </div>
          </div>

          {/* Mathematical Formula Breakdown */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Mathematical ATS Score Breakdown
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Weighted Algorithm</span>
            </div>

            {/* Keyword Match (40%) */}
            <div className="p-3.5 bg-slate-50/60 dark:bg-slate-850/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  1. Keyword Match (Weight: 40%)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {keywordScore} / 40 pts
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(keywordScore / 40) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coverage of mandatory hard tools, frameworks, and domain terminologies.
              </p>
            </div>

            {/* Experience & Seniority Match (30%) */}
            <div className="p-3.5 bg-slate-50/60 dark:bg-slate-850/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  2. Experience & Seniority Match (Weight: 30%)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {experienceScore} / 30 pts
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(experienceScore / 30) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {evaluation.seniorityAnalysis}
              </p>
            </div>

            {/* Skill Gap Penalty (-30% max) */}
            <div className="p-3.5 bg-slate-50/60 dark:bg-slate-850/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-rose-700 dark:text-rose-400">
                  3. Skill Gap Penalty (Max: -30%)
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  -{gapPenalty} pts
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(gapPenalty / 30) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {evaluation.gapAnalysis}
              </p>
            </div>
          </div>
        </div>

        {/* Matched & Missing Keywords Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Matched Keywords */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Key Matched Keywords ({evaluation.matchedKeywords.length})
              </h3>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Verified in resume</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50 min-h-[80px]">
              {evaluation.matchedKeywords.length > 0 ? (
                evaluation.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-white dark:bg-emerald-950/80 rounded-md border border-emerald-200 dark:border-emerald-800/80 shadow-2xs"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No direct hard keywords matched.</span>
              )}
            </div>
          </div>

          {/* Missing / Weak Keywords */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Missing / Weak Keywords ({evaluation.missingKeywords.length})
              </h3>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">! Target for tailoring</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3.5 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/50 min-h-[80px]">
              {evaluation.missingKeywords.length > 0 ? (
                evaluation.missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-300 bg-white dark:bg-amber-950/80 rounded-md border border-amber-200 dark:border-amber-800/80 shadow-2xs"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No major keyword gaps identified.</span>
              )}
            </div>
          </div>
        </div>

        {/* Strategic Next Step Branching Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/60 dark:from-slate-850 dark:to-slate-800/60 border border-slate-200 dark:border-slate-750">
          {isStrongMatch ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Case A: Direct Application Gate
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  The Base Resume exceeds the ATS threshold with an ATS score of {evaluation.overallScore}%.
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  No major tailoring required. Per strict safety constraints, application will only be submitted upon explicit user confirmation.
                </p>
              </div>

              <button
                onClick={onTriggerCaseA}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                <span>Proceed to Confirmation Gate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Case B: Tailoring Required
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  The Base Resume scored {evaluation.overallScore}%, falling below the {threshold}% threshold.
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Initiating resume tailoring. You will be able to review and approve proposed bullet enhancements line-by-line before any submission.
                </p>
              </div>

              <button
                onClick={onTriggerCaseB}
                disabled={isTailoringLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                <span>{isTailoringLoading ? 'Analyzing & Tailoring...' : 'Initiate Line-by-Line Tailoring'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
