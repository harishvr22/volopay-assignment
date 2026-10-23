# 3-Minute Continuous Screen Recording: Demo Script & Shot List

> **Instructions for Recording**: Record as a single, continuous video capture (no video cuts required) with your own spoken voiceover.
> **Total Duration**: 3:00 (180 seconds)
> **Recommended Screen Resolution**: 1920x1080 (Full Screen Browser at `http://localhost:5173`)

---

## Shot List & Visual Progression

| Timecode | Screen / Feature | On-Screen Action | Key Spoken Point |
|---|---|---|---|
| **0:00 – 0:35** | **Manager Dashboard** | Click through headline KPI cards (44 Distinct Records, 18 Usable Text Coverage, Connection Rate). Toggle Person and Source filters. | Explain data provenance, exact mathematical denominators, and why meeting organizers are not assumed to be salespeople. |
| **0:35 – 1:15** | **Conversation Inbox** | Scroll through the 44-record table. Filter for "Usable Text" vs "Unusable / Missing". Highlight C06. | Explain how missing text is surfaced without inventing CRM forecasts; highlight the C06 caller identity mismatch ("Ravi" vs "Meera"). |
| **1:15 – 2:05** | **Inspection / Detail View (Difficult Routing Decision)** | Select record **M07** (Willowfield Trust). Show 1-based turn citations. Show 4 software defects. Edit active route and save manual override. | Walk through the difficult triage case (post-sale defect escalation vs sales pipeline); demonstrate how manual route override is preserved. |
| **2:05 – 2:40** | **Imports & Replay (The Section 3.F Sequence)** | Open "Imports & Replay" tab. Click **"Run Automated Replay Test"**. Watch step-by-step verification checkmarks pass. | Explain the data contract: identity by `(source_type, source_id)`, deduplication on repeat imports, revision ordering, and override preservation. |
| **2:40 – 3:00** | **Exports & Manifest** | Switch to "Exports & Manifest" tab. Click **"Download Export Archive (.zip)"**; point to manifest path validation (100% verified). | Show real downloadable export package with JSON/CSV manifests, raw records, and traceable analyses. Wrap up. |

---

## Word-for-Word Spoken Narration Script

### [0:00 – 0:35] Part 1: Operational Manager Dashboard & Provenance
*(Visual: Start on the Dashboard at `http://localhost:5173`. Mouse cursor hovers over the 4 headline KPI cards).*

**Spoken Narration:**
> "Hello. Today I am presenting the SpendNest Revenue Intelligence Inbox, built directly on the supplied assessment dataset.
> 
> A sales manager's fundamental problem is fragmented, unverified data. Rather than inventing a generic CRM or fake deal values, this workspace provides 100% verifiable operational intelligence for all 44 interactions that took place on August 21st, 2026, in the Asia/Kolkata timezone.
> 
> On the dashboard, every headline number has an explicit mathematical denominator. We have exactly 44 distinct source records: 30 calls and 14 meetings. Usable text coverage is 18 of 44, or 40.9%, after applying the Revision 2 update. The remaining 26 records are voicemails, unanswered dials, or cancelled captures. Notice our strict rule: zero substantive analysis is inferred from absent text.
> 
> Notice also our attribution safeguard: call representatives like Arun and Meera are strictly distinguished from calendar meeting organizers. In calendar systems, an organizer is merely an invite creator—not verified sales attendance or closing authority."

---

### [0:35 – 1:15] Part 2: Conversation Inbox & Grounded Evidence
*(Visual: Click the "Inbox" tab. Table displays all 44 records. Filter by "Usable Text", then type "C06" in the search box).*

**Spoken Narration:**
> "Moving into the Conversation Inbox, we see all 44 records unified under the immutable identity `(source_type, source_id)`. Every record carries an intake state, source revision badge, and active destination route.
> 
> Let's look at one of our critical findings: Call C06. Upstream telephony metadata assigned the representative name as 'Meera'. But when we inspect the verbatim transcript, the rep actually begins: *'Good evening. Ravi here. I'll say at the start that this is a cold call.'*
> 
> A generic CRM would have blindly credited this call to Meera. Our intelligence engine detected this discrepancy, surfacing both stored metadata and transcript proof side-by-side, and routed it to **Sales Coaching** so management can audit phone profile sharing and caller ID configurations."

---

### [1:15 – 2:05] Part 3: Difficult Routing Decision & Inspection (Record M07)
*(Visual: Click on record M07 in the table or dropdown. Side-by-side view opens showing the 27-turn transcript on the left and the intelligence panel on the right).*

**Spoken Narration:**
> "Now let's examine our most difficult routing decision: record **M07**, the Willowfield Trust meeting.
> 
> In traditional sales tools, this meeting would be forced into a qualified pipeline opportunity. But looking at the evidence, Customer A is screen-sharing four severe software defects: event descriptions failing to save, document uploads failing in 'Recreate payment', reimbursements stuck in 'Processing', and a cached amount bug showing INR 18,200.
> 
> Our engine routes this to **Customer Follow-up** and **Sales Coaching/Escalation**, citing exact 1-based turn numbers—Turn 3, Turn 12, Turn 23, and Turn 25.
> 
> As a manager, I can modify this routing decision. I'll add **Manual Review**, enter my rationale: *'Escalating stuck reimbursement queue to engineering lead'*, and click **Save Route Override**. The system immediately flags this record as having an active manual override."

---

### [2:05 – 2:40] Part 4: The Mandatory Section 3.F Replay Test
*(Visual: Click on the "Imports & Replay" tab. Click the glowing "Run Automated Replay Test" button. Watch the 6 green checkmark steps appear sequentially).*

**Spoken Narration:**
> "Now let's test our data contract and replay requirements from Section 3.F. I'll click **Run Automated Replay Test**.
> 
> Step 1 imports `01_initial.json`: exactly 44 records are created, with 17 usable texts. At this stage, M07 has zero turns and unavailable reason 'no_speech'.
> 
> Step 2 repeats that import with records in reverse order. Notice no duplicate records are created: the count remains strictly 44, and 44 records are ignored.
> 
> Step 3 applies our manual route override to M07.
> 
> Step 4 imports `02_update.json` with Revision 2. M07's whole payload is replaced, supplying the 27-turn transcript. Usable text coverage increases to 18, and our manual override remains completely intact.
> 
> Step 5 re-imports Revision 1: the system correctly ignores the older revision, preserving Revision 2.
> 
> All states persist across browser refresh in local storage."

---

### [2:40 – 3:00] Part 5: Organised Export Archive & Verification
*(Visual: Click the "Exports & Manifest" tab. Click "Download Export Archive (.zip)". Show the green "100% PASSED" validation banner).*

**Spoken Narration:**
> "Finally, let's inspect the Exports tab. We produce a real, downloadable ZIP archive containing machine-readable JSON and CSV manifests, all 44 raw record envelopes, 18 differentiated Markdown analyses, and the Manager Brief.
> 
> Our in-browser validator tests every single relative path listed in the manifest against the actual files in the archive—with 100% pass verification.
> 
> Thank you for reviewing the SpendNest Revenue Intelligence Inbox."
