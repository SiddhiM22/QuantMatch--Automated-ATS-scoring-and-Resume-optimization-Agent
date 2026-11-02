# AI Career Strategist & ATS Optimization Agent

A high-precision career strategy and ATS evaluation platform that matches candidate resumes against LinkedIn, Naukri, and Indeed job descriptions, calculates strict ATS compatibility scores (Keyword 40%, Experience 30%, Skill Gap -30%), provides interactive line-by-line bullet tailoring without hallucinations, and enforces an unbreakable user confirmation gate before simulated application submission.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design and workflow decisions were confirmed through Phase 1 user clarification and govern the application architecture:

- **Resume Onboarding Choice**: Clean slate input allowing users to paste or upload their custom base resume in raw markdown/text with target role titles (plus an optional quick-load sample profile button for effortless demonstration).
- **Job Sourcing Choice**: Dedicated manual JD ingestion interface supporting LinkedIn, Naukri, and Indeed job descriptions with platform URLs, location, and key requirements.
- **Tailoring Review Choice**: Interactive line-by-line acceptance checklist with live keyword highlighting and dynamic projected score recalculation when ATS match falls below the 85% threshold.
- **Strict Confirmation Gate**: Zero autonomous submissions; simulated application trigger requires explicit, unprompted user confirmation in both Strong Match (>= 85%) and Tailored (< 85%) branches.
- **Anti-Hallucination Invariant**: Strictly rephrases existing scope, metrics, and achievements to embed target keywords; never invents degrees, companies, or ungrounded skills.

---

### 1. Overview & Core Concept

- **What It Does**: Empowers candidates to evaluate their resumes against target job descriptions using a rigorous ATS matching engine, automatically identifies keyword and seniority gaps, refines bullet points with an interactive line-by-line approval checklist, and safely tracks application submission gates.
- **Target Audience / Persona**: Engineers, technical managers, and knowledge workers seeking targeted, high-conversion job applications across LinkedIn, Naukri, and Indeed without risking ATS disqualification or unvetted auto-applications.
- **Key Value**: Eliminates the black-box nature of ATS screening with mathematical transparency (40% keyword, 30% experience, -30% gap penalty) while putting the candidate in 100% control of every bullet change and application submission.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Resume & Target Setup**: Candidate pastes/uploads base resume, sets target job titles/domains (e.g., Senior Backend Engineer, Full Stack Lead), and adjusts the minimum ATS threshold (defaults to 85%).
  2. **Job Ingestion & Discovery Queue**: User pastes job descriptions from LinkedIn, Naukri, or Indeed with job title, company, location, and platform URL. The agent curates and displays a ranked match table with key alignment highlights.
  3. **ATS Compatibility Evaluation**: The candidate selects a target job. The engine computes the ATS Match Score (%) with detailed breakdown:
     - Keyword Match (40%): Presence of required tools, frameworks, and domain terms.
     - Experience & Seniority Match (30%): Relevance of past roles, scope, and metrics.
     - Skill Gap Penalty (up to -30%): Deductions for essential missing hard skills.
     - ATS Evaluation Card: Displays score gauge, matched keywords, missing/weak keywords, and match verdict.
  4. **Branching Logic & Review**:
     - **Branch A (>= 85% Match)**: Informs candidate that base resume exceeds threshold; prompts explicit modal confirmation: *"Do you want to proceed with submitting the application to [Job Title] at [Company] using your Base Resume? (Yes/No)"*.
     - **Branch B (< 85% Match)**: Generates a tailored version of the resume. The user interacts with a **Line-by-Line Acceptance Checklist** where each rephrased bullet is presented with exact keyword diff highlights. As the user accepts/rejects changes, the projected ATS score dynamically updates.
  5. **Explicit Final Gate**: User reviews the tailored resume diff and explicitly clicks *"Approve & Submit Application"* or *"Request Further Adjustments"*.
  6. **Application Tracker**: Logs applied jobs, submission timestamps, tailored vs. base resume versions used, and platform links for easy follow-up.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Refined executive career operating system; clean slate canvas, crisp hairline dividers, high legibility.
  - *Color Palette*:
    - Canvas: Cool slate neutral (`#0F172A` / `#F8FAFC`)
    - Surface: Elevated pure white / slate-900 with subtle hairline borders (`#E2E8F0` / `#334155`)
    - Accents: Deep Cobalt / Indigo (`#2563EB` / `#4F46E5`) for primary actions
    - Semantic Status: Emerald (`#16A34A`) for strong match/verified keywords, Amber (`#D97706`) for gaps/needs tailoring, Crimson (`#DC2626`) for critical disqualifiers.
  - *Typography*: Plus Jakarta Sans for titles and navigation, DM Sans for dense readable body, and Tabular Monospace (`font-mono tabular-nums`) for match scores, metrics, and keyword counts.
  - *Anti-Slop Discipline*: Zero decorative pill sandwiches, no fake telemetry tickers, no arbitrary AI hype scores, single-elevation depth.

- **Interactive Feedback & Motion**:
  - Score gauge transition using smooth SVG stroke animation.
  - Real-time interactive bullet toggle with instant projected score recalculation.
  - Toast confirmation notifications when applications are confirmed and logged.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Gemini 3.8 Flash Integration for Semantic Extraction**:
  - *Chosen Approach*: Server-side Express proxy (`/api/ats/evaluate` and `/api/ats/tailor`) utilizing `@google/genai` with `gemini-3.8-flash` and strict JSON schemas (`responseSchema`).
  - *Why*: Accurate parsing of unstructured job descriptions and nuanced resume bullet point rephrasing without hallucinating credentials or metrics.
  - *Alternatives Considered*: Pure regex keyword matching was rejected because it misses synonyms (e.g., "K8s" vs "Kubernetes", "Postgres" vs "PostgreSQL") and cannot evaluate seniority context.

- **Decision 2: Interactive Line-by-Line Checklist vs. Monolithic Replacement**:
  - *Chosen Approach*: User reviews every single suggested bullet point adjustment with clear keyword annotations and can toggle individual bullets on or off.
  - *Why*: In direct alignment with the user's preference in Phase 1 and the career strategist persona. The candidate retains ultimate agency and ownership of their resume content.

- **Decision 3: Local Storage Persistence & Export**:
  - *Chosen Approach*: Browser `localStorage` for base resume, saved job postings, tailored variations, and application tracking history, accompanied by 1-click Markdown / Plain Text resume download.
  - *Why*: Immediate persistence without requiring external database setups while maintaining client data privacy.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Browser (React 19)                       │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand · Step Indicators · New Job · Reset Data)       │
├──────────────────┬─────────────────────────────┬───────────────────────┤
│  Resume Manager  │     Job Postings & JD       │   ATS Evaluation &    │
│  - Base Resume   │     - Manual Entry Form     │   Tailoring Studio    │
│  - Target Titles │     - LinkedIn/Naukri/Indeed│   - Score Breakdown   │
│  - Threshold (85)│     - Ranked Match Table    │   - Line-by-Line Diff │
└────────┬─────────┴──────────────┬──────────────┴───────────┬───────────┘
         │                        │                          │
         ▼                        ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Local Storage State Manager                     │
│  (BaseResume, TargetRoles, JobQueue, Evaluations, ApplicationLog)      │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ POST /api/ats/evaluate
                                  │ POST /api/ats/tailor
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express Backend (Node.js Server)                  │
│  - POST /api/ats/evaluate: Extract keywords, seniority, calculate ATS  │
│  - POST /api/ats/tailor: Generate truth-grounded bullet optimizations  │
│  - Google GenAI SDK (gemini-3.8-flash) with structured JSON schemas    │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Models**:
  - `BaseResume`: `{ id, rawText, parsedSkills, experienceYears, targetRoles }`
  - `JobPosting`: `{ id, title, company, platform: 'LinkedIn'|'Naukri'|'Indeed', location, url, jdText, addedAt }`
  - `ATSEvaluation`: `{ jobId, overallScore, keywordScore (40%), experienceScore (30%), gapPenalty (-30%), matchedKeywords: string[], missingKeywords: string[], seniorityVerdict: string, summary: string }`
  - `TailoredResume`: `{ jobId, originalResumeId, bulletAdjustments: Array<{ id, section, originalBullet, tailoredBullet, keywordAdded, approved: boolean }>, projectedScore: number, finalApproved: boolean }`
  - `ApplicationRecord`: `{ id, jobId, jobTitle, company, platform, appliedAt, resumeVersion: 'Base'|'Tailored', status: 'Submitted'|'Interviewing' }`

- **Interactive State Transitions**:
  - Adding a JD triggers ranked alignment preview.
  - Selecting a JD triggers ATS Evaluation Card with 40/30/-30 formula calculation.
  - If score >= 85%: Case A activates (Direct Apply Confirmation Modal with Yes/No buttons).
  - If score < 85%: Case B activates (Interactive Tailoring Studio with checklist, live diff, and explicit Approve & Apply gate).
