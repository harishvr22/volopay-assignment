# SpendNest Revenue Intelligence Inbox

A reviewable, evidence-grounded Revenue Intelligence Inbox built from the supplied assessment dataset.

---

## 1. Quick Start & Startup Instructions

### Prerequisites
- Node.js (v18 or higher recommended; v22 tested)
- npm (v9 or higher)

### Setup & Local Execution
```bash
# 1. Navigate to the candidate project directory
cd candidate

# 2. Install dependencies (React, Vite, TypeScript, Tailwind, Lucide, PapaParse, JSZip, Recharts, Vitest)
npm install

# 3. Start the Vite local development server
npm run dev
```
Open **`http://localhost:5173`** in any modern web browser.

The application automatically initializes in the **final post-update state** (44 distinct records, 18 usable supplied conversation texts), ready for immediate managerial review.

### Running Automated Test Suite
```bash
# Execute the Vitest test suite covering all 10 mandatory contract tests
npm test
```

### Production Build
```bash
npm run build
```

---

## 2. Core Architecture & Provenance

### Absolute Boundaries Maintained
1. **Zero Data Fabrication**: We did not invent a generic CRM, fake sales pipelines, fictional account names ("Northstar Logistics"), artificial deal stages, unverified attendee identities, or imaginary revenue totals.
2. **Strict Identity Contract**: Logical record identity is strictly the pair `(source_type, source_id)`. Records are never deduplicated by company title, phone, record reference, or array index.
3. **Whole-Payload Revision Replacement**: Higher revisions replace the entire source payload and transcript payload, including null values. Same or older revisions are ignored.
4. **Candidate State Separation**: Automated route suggestions, intake/review states, and explicit manager manual overrides are stored independently from raw source fields. Manual route overrides survive newer source revisions and re-imports.
5. **Local Persistence**: State persists across browser refresh via `localStorage` keys (`spendnest_revenue_intelligence_*`). A modal-confirmed "Clean Start" control allows resetting to an uninitialized state.

---

## 3. Mathematical Denominators & Metric Definitions

All selected activity falls on **21 August 2026** in **Asia/Kolkata**. Delivery envelope dates (22 August) represent batch packaging time, not conversation occurrence.

| Metric | Displayed Value | Mathematical Denominator & Definition |
|---|---|---|
| **Distinct Source Records** | **44** | Total unique `(source_type, source_id)` records. Exactly 30 calls and 14 meetings. |
| **Usable Text Coverage** | **40.91%** (18 / 44) | Records with non-blank conversation text divided by 44 total records (10 of 30 calls = 33.3%; 8 of 14 meetings = 57.1%). Pre-update coverage was 17 / 44 (38.64%) prior to receiving M07. |
| **Unusable / Missing Text** | **59.09%** (26 / 44) | Records with zero speech turns or null transcript (20 calls: voicemails and unanswered dials B01–B20; 6 meetings: cancelled M05, unscheduled M08, or uncaptured M11–M14). **Zero substantive analysis is inferred from absent text.** |
| **Telephony Connection Rate** | **33.33%** (10 / 30) | Upstream telecom status: 10 calls with `is_connected === true` divided by 30 calls with non-null `is_connected`. Substantive conversation occurred in 7 of these calls. |
| **Staff Attribution** | Reps vs Organizers | Telephony reps (Arun, Leela, Kiran, Meera, Dev) are caller accounts. Meeting organizers (team06–team14) are calendar invite creators; data does not establish that an organizer attended or served as the salesperson. |

---

## 4. How to Reproduce the Mandatory Section 3.F Replay Test

You can reproduce the complete sequence interactively in the UI or via automated tests:

### Method A: One-Click Automated Replay in the UI
1. Navigate to the **"Imports & Replay"** tab in the top navigation.
2. Click the glowing button **"Run Automated Replay Test"**.
3. Watch the 6 green checkmark steps execute sequentially:
   - **Step 1**: Ingests `01_initial.json` (Revision 1) → 44 distinct records, 17 usable texts. M07 has 0 turns (`unavailable_reason: no_speech`).
   - **Step 2**: Re-ingests `01_initial.json` with reversed record order → 0 duplicates added, 44 records ignored, count remains exactly 44.
   - **Step 3**: Applies a manual route override to **M07** (`Customer Follow-up` + `Sales Coaching`) with manager rationale.
   - **Step 4**: Ingests `02_update.json` (Revision 2) → M07 whole payload replaced with 27-turn transcript; usable text count rises to 18; **M07 manual route override remains active!**
   - **Step 5**: Re-ingests `01_initial.json` (Revision 1) → System detects older revision and ignores it. Revision 2 and the 27-turn transcript are preserved.
   - **Step 6**: Verifies M07 integrity and freshness.
4. Refresh your browser (F5) → Verify that M07 retains Revision 2, its 27 turns, and its manual route override.

### Method B: Automated Vitest Execution
Run:
```bash
npm test
```
Vitest executes `src/tests/revenueIntelligence.test.ts` across all 10 contract assertions (including order reversal, duplicate prevention, M07 payload replacement, override persistence, and manifest path validation).

---

## 5. Three Evidence-Backed Findings & One Rejected Decision

### Finding 1: Post-Sale Software Defect Escalation (M07) vs Sales Pipeline
- **Observation**: Customer A from Willowfield Trust screen-shares four severe billing & reimbursement software bugs: event description edits failing to persist upon save, document uploads disabled in "Recreate payment", reimbursement payments stuck in "Processing" state disabling selection, and a cached form bug retaining INR 18,200.
- **Source Citation**: Meeting `M07`, Turns 3, 12, 23, and 25 (`M07 turn 3`, `M07 turn 12`, `M07 turn 23`, `M07 turn 25`).
- **Product Decision Influenced**: Built a multi-route model pairing `Customer Follow-up` with `Sales Coaching` / Engineering Escalation. Designed the late-transcript update mechanism so Revision 2 refreshes analysis to "Fresh" without overwriting the manager's active manual route.
- **Where Reflected**: `ConversationDetail` view (freshness badge, 4-defect analysis), `Inbox` (M07 status badge), `exports/analysis/M07_analysis.md`, and test suite.

### Finding 2: Telephony Metadata Discrepancy with Spoken Caller Identity (C06)
- **Observation**: Call metadata recorded `rep_name` as "Meera" (`rep_email: meera@example.com`), but the representative explicitly introduced himself in the verbatim transcript as *"Ravi here. I'll say at the start that this is a cold call."*
- **Source Citation**: Call `C06`, Short exact quote: *"Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Product Decision Influenced**: Refrained from treating upstream metadata as verified truth. Displayed stored metadata and spoken identity side-by-side, adding a `Sales Coaching` route to audit telephony account sharing and caller ID profiles.
- **Where Reflected**: `Dashboard` (rep attribution disclaimer), `Inbox` (discrepancy indicator), `ConversationDetail` coaching panel, and `exports/analysis/C06_analysis.md`.

### Finding 3: Strict Regulatory Compliance Boundary in Partner Discovery (M01)
- **Observation**: Harborpath Advisory sought remote bank account opening for foreign clients. SpendNest team member A immediately established an essential qualification boundary: accounts are offered exclusively to registered corporate entities with a US presence, not individual consumers.
- **Source Citation**: Meeting `M01`, Turns 2 and 4 (`M01 turn 2`, `M01 turn 4`).
- **Product Decision Influenced**: Separated `Partner / Vendor Coordination` from direct customer sales routing. Created explicit qualification checklists in the conversation detail panel to prevent partner teams from pitching unviable prospects.
- **Where Reflected**: `Inbox` route filter, `ConversationDetail` compliance boundary panel, `exports/manifest.json`, and `exports/analysis/M01_analysis.md`.

---

### Deliberately Rejected Decision & Accepted Trade-Off
- **Rejected Alternative**: Automatically inferring CRM pipeline currency totals, win probabilities, and deal stages from conversational numbers (such as Asterloom's card counts, Willowfield's INR 18,200 bug amount, or retail store counts).
- **Why Rejected**: `DATA_DICTIONARY.md` strictly prohibits inventing pipeline numbers: *"Monetary amounts within conversation text keep their stated units; no comparable opportunity-value table is supplied... do not invent pipeline value, deal outcomes or account links that the data does not establish."* In reality, conversational numbers reflect software bugs or exploratory queries, not confirmed commercial bookings.
- **Trade-Off Accepted**: The workspace provides zero speculative revenue forecasting or pipeline charts, delivering instead 100% verifiable operational intelligence: activity counts, usable transcript coverage, and evidence-backed next steps.
- **Where Reflected**: Manager Dashboard (strict operational denominators without fake revenue totals), Definitions modal, and `exports/brief/manager_brief_2026-08-21.md`.

---

## 6. Output Organization & Export Archive

### Downloadable Archive & Local Outputs
- **In-Browser Export**: Navigate to the **"Exports & Manifest"** tab and click **"Download Export Archive (.zip)"**. This generates a compressed archive in memory and downloads it directly.
- **Local Staged Folder**: Outputs are also staged locally under `candidate/exports/`:
  - `exports/manifest.json`: Full manifest with `source_type`, `source_id`, `record_ref`, `applied_source_revision`, `routes`, `output_paths`, `processing_review_state`, `manual_override_flag`, `analysis_freshness`, `source_revision_analysed`.
  - `exports/manifest.csv`: CSV counterpart of the manifest.
  - `exports/routing_summary.csv`: Aggregated routing table with active routes, counts, and override statuses.
  - `exports/findings.json`: Structured JSON containing the 3 evidence findings and rejected decision.
  - `exports/brief/manager_brief_2026-08-21.md`: Synthesized Executive Manager Brief.
  - `exports/records/`: 44 individual raw record JSON files named `{source_type}_{source_id}.json`.
  - `exports/analysis/`: 18 differentiated Markdown analysis files named `{record_ref}_analysis.md`.

### Manifest Path Validation
Every active path listed in `manifest.json` and `manifest.csv` is validated to ensure it points to a physical file in the generated archive. The in-browser validator tests all 62 referenced paths across 65 physical files with **100% pass verification**.

---

## 7. Submission Artifacts

1. **Working Application & Editable Source**: All source files under `candidate/src/`, `package.json`, `tailwind.config.js`, `tsconfig.json`.
2. **Five Presentation Slides**:
   - `candidate/presentation/Revenue_Intelligence_Inbox_Presentation.pptx` (Editable 16:9 widescreen PPTX)
   - `candidate/presentation/Revenue_Intelligence_Inbox_Presentation.pdf` (High-resolution PDF version)
3. **3-Minute Narration Script & Shot List**:
   - `candidate/DEMO_SCRIPT.md` (Includes timed shot list, on-screen actions, and word-for-word spoken voiceover script)
4. **Organised Export Archive & Manifest**:
   - `candidate/exports/` on disk + downloadable ZIP via the UI.

---

## 8. AI Usage Disclosure, Time Allocation & Known Limitations

### Transparent AI Disclosure
- **Pre-generated vs Dynamic Calculation**: Sourced analyses for the 18 usable conversations and the Executive Manager Brief were prepared with AI assistance based strictly on inspected source transcripts. The application executes all deduplication, revision handling, filters, multi-route assignment, and manual override persistence **dynamically and deterministically at runtime**.
- **No Paid or External AI API**: No live model API is called at runtime; zero external credentials or paid accounts are required.

### Time Spent
- **Total Time**: Approximately **7.5 hours** (within the 6–8 hour assessment expectation).
  - Data contract & revision engine: 2.0 hours
  - UI components & SaaS interface: 2.5 hours
  - Analysis preparation & findings verification: 1.5 hours
  - Automated tests & export validation: 1.0 hour
  - Presentation slides, demo script & README: 0.5 hours

### Known Limitations & Future Improvements
1. **Curated Single-Day Window**: All 44 interactions fall on 21 August 2026. The dataset provides qualitative depth, not a multi-quarter rep performance ranking.
2. **Batch vs Live Telephony Sync**: Ingestion is file-based (batch JSON). In production, this would be backed by live telephony webhooks (e.g. Twilio/Genesys event streams).
3. **Future Extension**: Bidirectional CRM sync to push verified follow-up tasks directly into Salesforce or HubSpot.
