import React, { useState } from 'react';
import { JobPosting } from '../types';
import { ShieldAlert, CheckCircle2, XCircle, Send, ArrowLeft } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'CaseA' | 'CaseB';
  job: JobPosting;
  score: number;
  threshold: number;
  tailoredCount?: number;
  onConfirmSubmit: () => void;
  onRequestChanges: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  job,
  score,
  threshold,
  tailoredCount = 0,
  onConfirmSubmit,
  onRequestChanges,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmSubmit();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Icon & Gatekeeper Banner */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Strict Gatekeeper Protocol
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Explicit Application Confirmation
            </h3>
          </div>
        </div>

        {/* Modal Prompt Body according to prompt specifications */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          {type === 'CaseA' ? (
            <>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                The Base Resume exceeds the ATS threshold with an ATS score of{' '}
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{score}%</span> (Threshold: {threshold}%). No major tailoring required.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Do you want me to proceed with submitting the application to{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">{job.title}</span> at{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">{job.company}</span> ({job.platform}) using your Base Resume?
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                With your approved tailored adjustments ({tailoredCount} bullet edits), your projected ATS score is{' '}
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{score}%</span>, surpassing the {threshold}% threshold.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Please review the tailored resume adjustments. Do you approve this tailored version, and should I proceed to apply for{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">{job.title}</span> at{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">{job.company}</span> ({job.platform})?
                </p>
              </div>
            </>
          )}
        </div>

        {/* Target Job Quick Details */}
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Destination Platform:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{job.platform}</span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{job.location}</span>
          </div>
          <div className="flex justify-between">
            <span>Resume Payload:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {type === 'CaseA' ? 'Base Resume' : `Tailored Resume (${tailoredCount} edits)`}
            </span>
          </div>
        </div>

        {/* Confirmation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          {type === 'CaseA' ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                No, Don't Apply
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleApprove}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting Application...' : 'Yes, Proceed & Apply'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onRequestChanges}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Request Changes</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleApprove}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting Application...' : 'Approve & Apply'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
