import React, { useEffect, useState } from 'react';
import { JobPosting } from '../types';
import { CheckCircle2, Loader2, Sparkles, Cpu, Layers, FileText } from 'lucide-react';

interface ATSEvaluationProgressProps {
  job: JobPosting;
  isOpen: boolean;
}

const STEPS = [
  {
    id: 1,
    title: 'Parsing Base Resume Credentials',
    desc: 'Extracting verified languages, cloud platforms, seniority, and production scope.',
    icon: FileText,
    targetPercent: 28,
  },
  {
    id: 2,
    title: 'Scanning Job Description Requirements',
    desc: 'Extracting mandatory hard skills, toolchains, frameworks, and role responsibilities.',
    icon: Layers,
    targetPercent: 58,
  },
  {
    id: 3,
    title: 'Computing 40/30/-30 ATS Formula',
    desc: 'Calculating 40% Keyword Match, 30% Experience Seniority, and up to -30% Skill Gap penalty.',
    icon: Cpu,
    targetPercent: 86,
  },
  {
    id: 4,
    title: 'Formulating Verdict & Alignment Matrix',
    desc: 'Finalizing match threshold status, key strengths, and missing keyword insights.',
    icon: Sparkles,
    targetPercent: 100,
  },
];

export const ATSEvaluationProgress: React.FC<ATSEvaluationProgressProps> = ({ job, isOpen }) => {
  const [progress, setProgress] = useState(12);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(12);
      setActiveStepIndex(0);
      return;
    }

    // Smooth progress simulation while backend API evaluates
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 28) {
          setActiveStepIndex(0);
          return prev + 4;
        } else if (prev < 58) {
          setActiveStepIndex(1);
          return prev + 3;
        } else if (prev < 88) {
          setActiveStepIndex(2);
          return prev + 2;
        } else if (prev < 95) {
          setActiveStepIndex(3);
          return prev + 1;
        }
        return prev;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>ATS Compatibility Engine</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Evaluating ATS Match Score
            </h3>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
              {progress}%
            </span>
          </div>
        </div>

        {/* Target Role Context Banner */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Target Role:</span>{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{job.title}</span>
          </div>
          <span className="font-medium text-slate-600 dark:text-slate-400">{job.company}</span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Parsing</span>
            <span>Entity Extraction</span>
            <span>Formula Weighting</span>
            <span>Verdict</span>
          </div>
        </div>

        {/* Steps Audit Checklist */}
        <div className="space-y-3 pt-2">
          {STEPS.map((step, idx) => {
            const isCompleted = progress >= step.targetPercent;
            const isCurrent = idx === activeStepIndex && !isCompleted;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/60 text-slate-800 dark:text-slate-200'
                    : isCurrent
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/80 text-slate-900 dark:text-white ring-1 ring-indigo-500/10'
                    : 'bg-transparent border-transparent text-slate-400 dark:text-slate-600'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="text-xs font-semibold leading-tight flex items-center justify-between">
                    <span>{step.title}</span>
                    {isCompleted && (
                      <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        Complete
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-[11px] text-slate-400">
          Enforcing strict mathematical accuracy (Keyword 40% + Experience 30% - Skill Gap 30%)
        </div>
      </div>
    </div>
  );
};
