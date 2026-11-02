import React from 'react';
import { JobPosting, ATSEvaluation, BaseResume } from '../types';
import { ATSEvaluationCard } from './ATSEvaluationCard';
import { Sparkles, ArrowRight, FileCheck, AlertCircle, Play, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface ATSEvaluationStudioProps {
  evaluation: ATSEvaluation | null;
  selectedJob: JobPosting | null;
  jobs: JobPosting[];
  resume: BaseResume;
  threshold: number;
  onEvaluateJob: (job: JobPosting) => void;
  onTriggerCaseA: () => void;
  onTriggerCaseB: () => void;
  onBackToJobs: () => void;
  onUploadResumeTab: () => void;
  isEvaluating: boolean;
  isTailoring: boolean;
}

export const ATSEvaluationStudio: React.FC<ATSEvaluationStudioProps> = ({
  evaluation,
  selectedJob,
  jobs,
  resume,
  threshold,
  onEvaluateJob,
  onTriggerCaseA,
  onTriggerCaseB,
  onBackToJobs,
  onUploadResumeTab,
  isEvaluating,
  isTailoring,
}) => {
  const hasResume = Boolean(resume.rawText && resume.rawText.trim().length > 0);

  // If we already have an active evaluation and job, render the full ATS Evaluation Card
  if (evaluation && selectedJob) {
    return (
      <ATSEvaluationCard
        evaluation={evaluation}
        selectedJob={selectedJob}
        threshold={threshold}
        onTriggerCaseA={onTriggerCaseA}
        onTriggerCaseB={onTriggerCaseB}
        onBackToJobs={onBackToJobs}
        isTailoringLoading={isTailoring}
      />
    );
  }

  // Otherwise, render the dedicated ATS Evaluation Studio Launchpad
  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Step 2 · Threshold Gate & Algorithmic Scoring
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display mt-1">
            ATS Evaluation Studio
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Compare candidate resume against target job descriptions using the 40/30/-30 ATS formula.
          </p>
        </div>

        {/* Resume status badge */}
        <div className="flex items-center gap-3">
          {hasResume ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
              <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Base Resume Active ({resume.fileName || 'Verified Document'})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-4 h-4" />
                No resume file uploaded yet
              </span>
              <button
                onClick={onUploadResumeTab}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 cursor-pointer"
              >
                Upload Resume File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formula Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Keyword Match</span>
            <span className="font-mono">40% Max</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Identifies mandatory tech tools, frameworks, and domain terminologies present in both JD and resume.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
            <span>Experience & Seniority</span>
            <span className="font-mono">30% Max</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Evaluates years of professional practice, architectural leadership, and production metrics.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
            <span>Skill Gap Penalty</span>
            <span className="font-mono">-30% Max</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Deducts points for critical missing hard skills required by the employer.
          </p>
        </div>
      </div>

      {/* Select Job to Evaluate Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Select Opening to Evaluate
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose any opening from your queue to run the full ATS analysis against your resume.
              </p>
            </div>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all bg-slate-50/50 dark:bg-slate-850/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {job.company} · {job.platform} · {job.location}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {job.platform}
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onEvaluateJob(job)}
                    disabled={isEvaluating}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Run ATS Evaluation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No job postings currently in your queue. Add a job opening by URL in the Job Queue to evaluate ATS compatibility.
            </p>
            <div className="flex justify-center">
              <button
                onClick={onBackToJobs}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
              >
                <span>Go to Job Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
