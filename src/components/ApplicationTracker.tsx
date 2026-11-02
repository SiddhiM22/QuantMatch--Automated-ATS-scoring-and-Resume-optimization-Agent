import React from 'react';
import { ApplicationRecord } from '../types';
import { ExternalLink, CheckCircle, Clock, Trash2, FileCheck, Briefcase } from 'lucide-react';

interface ApplicationTrackerProps {
  records: ApplicationRecord[];
  onUpdateStatus: (id: string, status: ApplicationRecord['status']) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onNavigateToJobs: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  records,
  onUpdateStatus,
  onDeleteRecord,
  onClearAll,
  onNavigateToJobs,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Application Submissions & Activity Log
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Real-time audit log of all confirmed job applications submitted through strict gatekeeper verification.
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Confirmed Applications
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {records.length} Total Submissions
          </span>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No job applications submitted yet.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Evaluate a job description in your queue and give explicit confirmation to record an application.
              </p>
            </div>
            <button
              onClick={onNavigateToJobs}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
            >
              Explore Job Queue
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/75 text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Platform & Location</th>
                  <th className="py-3 px-4">Submission ATS Score</th>
                  <th className="py-3 px-4">Resume Version</th>
                  <th className="py-3 px-4">Date Applied</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {records.map((record) => {
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                          {record.jobTitle}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {record.company}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {record.platform}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {record.location}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {record.atsScore}%
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>{record.resumeVersion}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(record.appliedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={record.status}
                          onChange={(e) => onUpdateStatus(record.id, e.target.value as ApplicationRecord['status'])}
                          className="text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Screening">Screening</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {record.url && (
                            <a
                              href={record.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                              title="Open original listing"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                            title="Remove log entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
