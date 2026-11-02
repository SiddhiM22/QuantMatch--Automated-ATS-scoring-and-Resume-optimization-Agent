import React, { useState } from 'react';
import { BulletAdjustment, JobPosting, TailorResponse } from '../types';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, Copy, CheckCheck, RefreshCw, ChevronRight } from 'lucide-react';

interface TailoringChecklistProps {
  job: JobPosting;
  tailorData: TailorResponse;
  originalScore: number;
  threshold: number;
  onApproveAndProceed: (finalTailoredBullets: BulletAdjustment[], finalScore: number) => void;
  onBackToEvaluation: () => void;
}

export const TailoringChecklist: React.FC<TailoringChecklistProps> = ({
  job,
  tailorData,
  originalScore,
  threshold,
  onApproveAndProceed,
  onBackToEvaluation,
}) => {
  const [bullets, setBullets] = useState<BulletAdjustment[]>(tailorData.bulletAdjustments);
  const [copied, setCopied] = useState(false);

  // Toggle individual bullet approval
  const handleToggleBullet = (id: string) => {
    setBullets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, approved: !b.approved } : b))
    );
  };

  // Select all or deselect all
  const handleSelectAll = (val: boolean) => {
    setBullets((prev) => prev.map((b) => ({ ...b, approved: val })));
  };

  // Recalculate dynamic projected score based on active approved adjustments
  const approvedBullets = bullets.filter((b) => b.approved);
  const totalPossibleGain = bullets.reduce((sum, b) => sum + b.impactScore, 0);
  const activeGain = approvedBullets.reduce((sum, b) => sum + b.impactScore, 0);

  // Projected score bounded between originalScore and tailorData.projectedScore
  const maxProjected = tailorData.projectedScore;
  const currentProjectedScore = totalPossibleGain > 0
    ? Math.round(originalScore + (activeGain / totalPossibleGain) * (maxProjected - originalScore))
    : originalScore;

  const isMeetingThreshold = currentProjectedScore >= threshold;

  const handleCopyTailoredText = () => {
    const text = bullets
      .filter((b) => b.approved)
      .map((b) => `• ${b.tailoredBullet}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button onClick={onBackToEvaluation} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            ATS Evaluation
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Line-by-Line Tailoring Studio
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 dark:text-slate-300">
            {job.company} ({job.title})
          </span>
        </div>

        <button
          onClick={onBackToEvaluation}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          ← Return to Evaluation Score
        </button>
      </div>

      {/* Main Header & Projected ATS Meter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Step 3 · Line-by-Line Acceptance Checklist</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display mt-1">
              Resume Tailoring & Keyword Alignment
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Review each proposed bullet point adjustment. Toggle individual edits to see the projected ATS score dynamically update.
            </p>
          </div>

          {/* Dynamic Score Indicator Box */}
          <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Base Resume Score</div>
              <div className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300 line-through tabular-nums">
                {originalScore}%
              </div>
            </div>

            <div className="text-2xl text-slate-300 dark:text-slate-600 font-light">→</div>

            <div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <span>Projected ATS Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold font-mono tracking-tight tabular-nums ${
                    isMeetingThreshold
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {currentProjectedScore}%
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  (Goal: ≥{threshold}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Hallucination & Summary of Changes Box */}
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Strict Anti-Hallucination Invariant Applied</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
            {tailorData.summaryOfChanges.map((summary, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">✓</span>
                <span>{summary}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Checklist Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {approvedBullets.length} of {bullets.length} adjustments approved
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => handleSelectAll(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Select All
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => handleSelectAll(false)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Deselect All
            </button>
          </div>

          <button
            onClick={handleCopyTailoredText}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {copied ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied approved bullets!' : 'Copy approved bullets'}</span>
          </button>
        </div>

        {/* Line-by-Line Bullet Adjustments Cards */}
        <div className="space-y-4">
          {bullets.map((bullet, idx) => {
            return (
              <div
                key={bullet.id}
                className={`p-5 rounded-xl border transition-all ${
                  bullet.approved
                    ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800/80 shadow-xs ring-1 ring-indigo-500/10'
                    : 'bg-slate-50/60 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleBullet(bullet.id)}
                      className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                        bullet.approved
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="space-y-3 flex-1">
                      {/* Section & Keyword Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Adjustment #{idx + 1} · {bullet.section}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 rounded-md border border-indigo-100 dark:border-indigo-900">
                          Keyword Embedded: {bullet.keywordAdded}
                        </span>
                        <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                          +{bullet.impactScore}% ATS Boost
                        </span>
                      </div>

                      {/* Original Bullet (Struck through or subtle) */}
                      <div className="p-3 bg-slate-100/70 dark:bg-slate-850/70 rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                          Original Verbatim Bullet:
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 line-through decoration-slate-400/60">
                          {bullet.originalBullet}
                        </p>
                      </div>

                      {/* Tailored Bullet */}
                      <div className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/50 text-xs sm:text-sm space-y-1">
                        <div className="font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                          Proposed Tailored Bullet:
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                          {bullet.tailoredBullet}
                        </p>
                      </div>

                      {/* Rationale */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                        Rationale: {bullet.rationale}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Gate Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ready to submit application?
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submitting requires explicit final confirmation on the next screen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToEvaluation}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancel & Back
            </button>

            <button
              onClick={() => onApproveAndProceed(bullets, currentProjectedScore)}
              disabled={approvedBullets.length === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                approvedBullets.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Review Final Application Gate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
