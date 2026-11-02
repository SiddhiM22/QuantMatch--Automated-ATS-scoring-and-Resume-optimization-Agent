import React, { useState } from 'react';
import { JobPosting, Platform } from '../types';
import { Plus, ExternalLink, ArrowRight, Trash2, Eye, Briefcase, Globe, Loader2, Sparkles, Link } from 'lucide-react';

interface JobQueueProps {
  jobs: JobPosting[];
  selectedJobId: string | null;
  onSelectJob: (job: JobPosting) => void;
  onAddJob: (job: Omit<JobPosting, 'id' | 'addedAt'>) => void;
  onDeleteJob: (id: string) => void;
  isEvaluating: boolean;
}

export const JobQueue: React.FC<JobQueueProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
  onAddJob,
  onDeleteJob,
  isEvaluating,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingJdJob, setViewingJdJob] = useState<JobPosting | null>(null);

  // URL Scraping state
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  // Manual Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [platform, setPlatform] = useState<Platform>('LinkedIn');
  const [location, setLocation] = useState('Remote');
  const [url, setUrl] = useState('');
  const [jdText, setJdText] = useState('');

  // Handle URL Scraping & Extraction
  const handleScrapeUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = scrapeUrl.trim();
    if (!cleanUrl) return;

    setIsScraping(true);
    setScrapeError(null);

    try {
      const res = await fetch('/api/jobs/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to scrape job content from URL.');
      }

      const extracted = await res.json();

      onAddJob({
        title: extracted.title || 'Software Engineer',
        company: extracted.company || 'Company',
        platform: extracted.platform || 'LinkedIn',
        location: extracted.location || 'Remote',
        url: extracted.url || cleanUrl,
        jdText: extracted.jdText || 'Job description extracted from URL.',
        keyAlignmentHighlights: extracted.keyAlignmentHighlights || [
          `Scraped directly from ${extracted.platform || 'Job Board'}`,
          `Ready for ATS Keyword and Seniority analysis`,
        ],
      });

      setScrapeUrl('');
    } catch (err) {
      console.error(err);
      setScrapeError('Could not scrape job from URL. You can still paste details manually using the form.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !jdText.trim()) return;

    onAddJob({
      title: title.trim(),
      company: company.trim(),
      platform,
      location: location.trim() || 'Remote',
      url: url.trim() || 'https://www.linkedin.com/jobs',
      jdText: jdText.trim(),
      keyAlignmentHighlights: [
        `Custom entry sourced from ${platform}`,
        `Ready for ATS Keyword and Seniority analysis`,
      ],
    });

    // Reset Form
    setTitle('');
    setCompany('');
    setUrl('');
    setJdText('');
    setShowAddForm(false);
  };

  const getPlatformBadgeColor = (p: Platform) => {
    switch (p) {
      case 'LinkedIn':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
      case 'Naukri':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
      case 'Indeed':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Step 1 · Job Discovery & Ranked Matching
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display mt-1">
            Job Openings Queue
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Extract job postings by pasting any job URL (LinkedIn, Naukri, Indeed), or add job details manually.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manual Form Entry</span>
        </button>
      </div>

      {/* URL Job Content Extractor Card */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Extract Job Posting by URL
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paste a LinkedIn, Naukri, or Indeed job URL to automatically scrape and extract the job description.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">
            LinkedIn · Naukri · Indeed · Careers
          </span>
        </div>

        <form onSubmit={handleScrapeUrl} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Link className="w-4 h-4" />
            </div>
            <input
              type="url"
              required
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder="Paste job URL (e.g. https://www.linkedin.com/jobs/view/... or naukri.com / indeed.com)"
              className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isScraping || !scrapeUrl.trim()}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0 ${
              isScraping || !scrapeUrl.trim()
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
            }`}
          >
            {isScraping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scraping & Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Add to Queue</span>
              </>
            )}
          </button>
        </form>

        {scrapeError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>{scrapeError}</span>
            <button
              onClick={() => setScrapeError(null)}
              className="text-rose-400 hover:text-rose-600 text-sm font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Ranked Job Matching Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Target Job Openings & Alignment Highlights
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {jobs.length} Active Openings
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No job postings in your queue yet.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Paste any job URL from LinkedIn, Naukri, or Indeed in the extractor above to automatically scrape the job description.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
              >
                + Paste JD Manually
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/75 text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Job Title & Company</th>
                  <th className="py-3 px-4">Platform & Location</th>
                  <th className="py-3 px-4">Key Alignment Highlights</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {jobs.map((job, idx) => {
                  const isSelected = job.id === selectedJobId;
                  return (
                    <tr
                      key={job.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-850/50'
                      }`}
                    >
                      {/* ID / Rank */}
                      <td className="py-4 px-4 font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                        #{idx + 1}
                      </td>

                      {/* Title & Company */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                          {job.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <span>{job.company}</span>
                          {job.url && (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-indigo-600 inline-flex items-center"
                              title="Open original listing"
                            >
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Platform & Location */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md border ${getPlatformBadgeColor(
                            job.platform
                          )}`}
                        >
                          {job.platform}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {job.location}
                        </div>
                      </td>

                      {/* Key Alignment Highlights */}
                      <td className="py-4 px-4 max-w-md">
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {job.keyAlignmentHighlights && job.keyAlignmentHighlights.length > 0 ? (
                            job.keyAlignmentHighlights.slice(0, 2).map((highlight, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-1.5 leading-relaxed">
                                <span className="text-indigo-500 shrink-0 font-bold">·</span>
                                <span>{highlight}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-400">Click evaluate to calculate match highlights</li>
                          )}
                        </ul>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingJdJob(job)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View full job description"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteJob(job.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Remove opening"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onSelectJob(job)}
                            disabled={isEvaluating && isSelected}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
                            }`}
                          >
                            <span>{isSelected ? 'Evaluating...' : 'Select & Evaluate ATS'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Manual JD Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Add Target Job Opening Manually
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Paste role details from LinkedIn, Naukri, or Indeed for ATS evaluation.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitManual} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer II"
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe, Swiggy, or Indeed"
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Platform *
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Indeed">Indeed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote / Bangalore / Austin"
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Posting URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Job Description (JD) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the raw text of the job description here, including responsibilities, hard skills, tools, frameworks, and requirements..."
                  className="w-full p-3 font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                >
                  Save & Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JD Viewer Drawer / Modal */}
      {viewingJdJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {viewingJdJob.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{viewingJdJob.company}</span>
                  <span>·</span>
                  <span>{viewingJdJob.platform}</span>
                  <span>·</span>
                  <span>{viewingJdJob.location}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingJdJob(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {viewingJdJob.jdText}
              </pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">
                {viewingJdJob.jdText.split(/\s+/).length} words
              </span>
              <button
                onClick={() => {
                  const jobToEval = viewingJdJob;
                  setViewingJdJob(null);
                  onSelectJob(jobToEval);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <span>Evaluate ATS Score</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
