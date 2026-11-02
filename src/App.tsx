import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { BaseResume, JobPosting, ATSEvaluation, TailorResponse, ApplicationRecord, BulletAdjustment } from './types';
import { Navbar } from './components/Navbar';
import { ResumeManager } from './components/ResumeManager';
import { JobQueue } from './components/JobQueue';
import { ATSEvaluationStudio } from './components/ATSEvaluationStudio';
import { TailoringChecklist } from './components/TailoringChecklist';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ATSEvaluationProgress } from './components/ATSEvaluationProgress';
import { AuthLandingPage } from './components/AuthLandingPage';
import { initAuth, googleSignIn, googleSignOut } from './lib/auth';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cs_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cs_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Google OAuth Auth State (Mandatory Gate)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        setAuthInitialized(true);
      },
      () => {
        setCurrentUser(null);
        setAuthInitialized(true);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        showToast('Signed In', `Welcome back, ${result.user.displayName || result.user.email}!`);
      }
    } catch (err: any) {
      console.warn('Google sign-in notice:', err);
      showToast('Sign-In Notice', 'Google sign-in popup was cancelled or needs popup permission.', 'info');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await googleSignOut();
      setCurrentUser(null);
      showToast('Signed Out', 'You have been signed out from Google.');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Base Resume State
  const [resume, setResume] = useState<BaseResume>(() => {
    const saved = localStorage.getItem('cs_base_resume');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'base-1',
      name: '',
      email: '',
      targetTitles: ['Software Engineer II', 'Backend', 'Full Stack'],
      rawText: '',
      experienceYears: 4,
      detectedSkills: [],
      updatedAt: new Date().toISOString(),
    };
  });

  useEffect(() => {
    localStorage.setItem('cs_base_resume', JSON.stringify(resume));
  }, [resume]);

  // Minimum ATS threshold (default 85%)
  const [threshold, setThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('cs_ats_threshold');
    return saved ? parseInt(saved, 10) : 85;
  });

  useEffect(() => {
    localStorage.setItem('cs_ats_threshold', threshold.toString());
  }, [threshold]);

  // Job Postings Queue - Initialized empty
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem('cs_job_queue');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((j: JobPosting) => !['job-1', 'job-2', 'job-3'].includes(j.id));
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cs_job_queue', JSON.stringify(jobs));
  }, [jobs]);

  // Applications Log
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('cs_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cs_applications', JSON.stringify(applications));
  }, [applications]);

  // Navigation & Active View State
  const [currentTab, setCurrentTab] = useState<'resume' | 'jobs' | 'evaluate' | 'tailor' | 'tracker'>('resume');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [evaluation, setEvaluation] = useState<ATSEvaluation | null>(null);
  const [tailorData, setTailorData] = useState<TailorResponse | null>(null);

  // Loading States
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluatingJob, setEvaluatingJob] = useState<JobPosting | null>(null);
  const [isTailoring, setIsTailoring] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);

  // Strict Confirmation Modal State
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'CaseA' | 'CaseB';
    job: JobPosting;
    score: number;
    tailoredCount?: number;
    finalApprovedBullets?: BulletAdjustment[];
  } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Evaluate ATS Compatibility
  const handleSelectAndEvaluateJob = async (job: JobPosting) => {
    setSelectedJob(job);
    setEvaluatingJob(job);
    setIsEvaluating(true);

    if (!resume.rawText.trim()) {
      setIsEvaluating(false);
      setEvaluatingJob(null);
      showToast('Resume File Required', 'Please upload your base resume file before evaluating ATS compatibility.', 'info');
      setCurrentTab('resume');
      return;
    }

    const resumeContent = resume.rawText;

    try {
      const [res] = await Promise.all([
        fetch('/api/ats/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: resumeContent,
            jobTitle: job.title,
            company: job.company,
            platform: job.platform,
            location: job.location,
            jdText: job.jdText,
            threshold,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1400)),
      ]);

      if (!res.ok) {
        throw new Error('Evaluation request failed');
      }

      const evalData = await res.json();
      const completeEvaluation: ATSEvaluation = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        platform: job.platform,
        overallScore: evalData.overallScore,
        keywordScore: evalData.keywordScore,
        experienceScore: evalData.experienceScore,
        gapPenalty: evalData.gapPenalty,
        matchedKeywords: evalData.matchedKeywords || [],
        missingKeywords: evalData.missingKeywords || [],
        verdict: evalData.verdict,
        alignmentHighlights: evalData.alignmentHighlights || [],
        seniorityAnalysis: evalData.seniorityAnalysis || 'Experience match evaluated.',
        gapAnalysis: evalData.gapAnalysis || 'Skill gap analysis complete.',
        evaluatedAt: new Date().toISOString(),
      };

      setEvaluation(completeEvaluation);

      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                cachedScore: evalData.overallScore,
                keyAlignmentHighlights: completeEvaluation.alignmentHighlights,
              }
            : j
        )
      );

      setCurrentTab('evaluate');
    } catch (err) {
      console.error(err);
      showToast('Evaluation Error', 'Failed to calculate ATS score. Please try again.', 'info');
    } finally {
      setIsEvaluating(false);
      setEvaluatingJob(null);
    }
  };

  // Branch B: Trigger Resume Tailoring
  const handleInitiateTailoring = async () => {
    if (!selectedJob || !evaluation) return;
    setIsTailoring(true);

    try {
      const res = await fetch('/api/ats/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resume.rawText,
          jdText: selectedJob.jdText,
          jobTitle: selectedJob.title,
          company: selectedJob.company,
          matchedKeywords: evaluation.matchedKeywords,
          missingKeywords: evaluation.missingKeywords,
          threshold,
        }),
      });

      if (!res.ok) {
        throw new Error('Tailoring request failed');
      }

      const data = await res.json();
      setTailorData(data);
      setCurrentTab('tailor');
    } catch (err) {
      console.error(err);
      showToast('Tailoring Error', 'Failed to generate tailored resume. Please retry.', 'info');
    } finally {
      setIsTailoring(false);
    }
  };

  // Case A Confirmation Gate (Score >= 85%)
  const handleTriggerCaseA = () => {
    if (!selectedJob || !evaluation) return;
    setConfirmationModal({
      isOpen: true,
      type: 'CaseA',
      job: selectedJob,
      score: evaluation.overallScore,
    });
  };

  // Case B Confirmation Gate (Reviewing Tailored adjustments)
  const handleApproveAndProceedTailoring = (
    finalApprovedBullets: BulletAdjustment[],
    finalProjectedScore: number
  ) => {
    if (!selectedJob) return;
    setConfirmationModal({
      isOpen: true,
      type: 'CaseB',
      job: selectedJob,
      score: finalProjectedScore,
      tailoredCount: finalApprovedBullets.filter((b) => b.approved).length,
      finalApprovedBullets,
    });
  };

  // Strict Final Submission Action
  const handleFinalConfirmApplication = () => {
    if (!confirmationModal) return;

    const { job, score, type, tailoredCount } = confirmationModal;

    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      platform: job.platform,
      location: job.location,
      url: job.url,
      atsScore: score,
      resumeVersion: type === 'CaseA' ? 'Base Resume' : 'Tailored Resume',
      appliedAt: new Date().toISOString(),
      status: 'Submitted',
      tailoredBulletsCount: tailoredCount || 0,
    };

    setApplications((prev) => [newRecord, ...prev]);
    setConfirmationModal(null);

    showToast(
      'Application Submitted & Logged',
      `Explicit approval received. Application submitted to ${job.title} at ${job.company} (${job.platform}).`
    );

    setCurrentTab('tracker');
  };

  // Add Job
  const handleAddJob = (newJob: Omit<JobPosting, 'id' | 'addedAt'>) => {
    const job: JobPosting = {
      ...newJob,
      id: `job-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    setJobs((prev) => [job, ...prev]);
    showToast('Job Added', `${job.title} at ${job.company} added to queue.`);
  };

  // Delete Job
  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (selectedJob?.id === id) {
      setSelectedJob(null);
      setEvaluation(null);
    }
  };

  // 1. Initial Auth Loading State
  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-slate-500 font-mono">Initializing QuantMatch...</span>
        </div>
      </div>
    );
  }

  // 2. Mandatory Google Sign-In Landing Page
  if (!currentUser) {
    return (
      <AuthLandingPage
        onSignIn={handleGoogleSignIn}
        isSigningIn={isSigningIn}
      />
    );
  }

  // 3. Authenticated Application Workspace
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAddJob={() => setCurrentTab('jobs')}
        jobCount={jobs.length}
        appliedCount={applications.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        user={currentUser}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleGoogleSignOut}
        isSigningIn={isSigningIn}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'resume' && (
          <ResumeManager
            resume={resume}
            onUpdateResume={(updated) => setResume((prev) => ({ ...prev, ...updated }))}
            threshold={threshold}
            onChangeThreshold={(val) => setThreshold(val)}
            onProceedToJobs={() => setCurrentTab('jobs')}
          />
        )}

        {currentTab === 'jobs' && (
          <JobQueue
            jobs={jobs}
            selectedJobId={selectedJob?.id || null}
            onSelectJob={handleSelectAndEvaluateJob}
            onAddJob={handleAddJob}
            onDeleteJob={handleDeleteJob}
            isEvaluating={isEvaluating}
          />
        )}

        {currentTab === 'evaluate' && (
          <ATSEvaluationStudio
            evaluation={evaluation}
            selectedJob={selectedJob}
            jobs={jobs}
            resume={resume}
            threshold={threshold}
            onEvaluateJob={handleSelectAndEvaluateJob}
            onTriggerCaseA={handleTriggerCaseA}
            onTriggerCaseB={handleInitiateTailoring}
            onBackToJobs={() => setCurrentTab('jobs')}
            onUploadResumeTab={() => setCurrentTab('resume')}
            isEvaluating={isEvaluating}
            isTailoring={isTailoring}
          />
        )}

        {currentTab === 'tailor' && selectedJob && evaluation && tailorData && (
          <TailoringChecklist
            job={selectedJob}
            tailorData={tailorData}
            originalScore={evaluation.overallScore}
            threshold={threshold}
            onApproveAndProceed={handleApproveAndProceedTailoring}
            onBackToEvaluation={() => setCurrentTab('evaluate')}
          />
        )}

        {currentTab === 'tracker' && (
          <ApplicationTracker
            records={applications}
            onUpdateStatus={(id, status) => {
              setApplications((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status } : a))
              );
            }}
            onDeleteRecord={(id) => {
              setApplications((prev) => prev.filter((a) => a.id !== id));
            }}
            onClearAll={() => setApplications([])}
            onNavigateToJobs={() => setCurrentTab('jobs')}
          />
        )}
      </main>

      {/* Strict Application Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          type={confirmationModal.type}
          job={confirmationModal.job}
          score={confirmationModal.score}
          threshold={threshold}
          tailoredCount={confirmationModal.tailoredCount}
          onConfirmSubmit={handleFinalConfirmApplication}
          onRequestChanges={() => {
            setConfirmationModal(null);
            setCurrentTab('tailor');
          }}
          onCancel={() => setConfirmationModal(null)}
        />
      )}

      {/* ATS Evaluation Progress Bar Modal */}
      {evaluatingJob && (
        <ATSEvaluationProgress job={evaluatingJob} isOpen={isEvaluating} />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-xl max-w-sm border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold font-display">{toastMessage.title}</h4>
            <p className="text-xs text-slate-300 dark:text-slate-600 leading-relaxed">
              {toastMessage.desc}
            </p>
          </div>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>QuantMatch Quantitative ATS Optimization & Application Confirmation Agent</span>
          <span>Strict Gatekeeping · Zero Fabricated Experience Guarantee</span>
        </div>
      </footer>
    </div>
  );
}
