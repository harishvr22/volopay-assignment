export interface ManagerBriefSection {
  title: string;
  badge?: string;
  content: string[];
  traceableReferences?: { ref: string; note: string }[];
}

export interface ManagerBrief {
  briefDate: string; // "21 August 2026"
  timezone: string; // "Asia/Kolkata"
  generatedAt: string;
  isPreGenerated: boolean;
  disclosureNote: string;
  sections: ManagerBriefSection[];
}

export const MANAGER_BRIEF_2026_08_21: ManagerBrief = {
  briefDate: '21 August 2026',
  timezone: 'Asia/Kolkata',
  generatedAt: '2026-08-22T10:30:00+05:30',
  isPreGenerated: true,
  disclosureNote:
    'This manager brief is pre-generated based on full synthesis of all 18 usable conversations after applying the Revision 2 update. It reflects the selected operational activity of 21 August 2026 in Asia/Kolkata. Calculations do not extrapolate beyond supplied records.',
  sections: [
    {
      title: '1. Activity Overview & Strict Denominator Definitions',
      badge: 'Operational Metrics',
      content: [
        'Total Selected Records: 44 distinct interactions (30 calls, 14 meetings). All records occurred on 21 August 2026 (Asia/Kolkata).',
        'Usable Text Coverage: 18 of 44 records (40.91%) contain usable supplied conversation text after applying the Revision 2 update (10 of 30 calls = 33.33%; 8 of 14 meetings = 57.14%). Pre-update coverage was 17 records (38.64%) prior to receiving M07.',
        'Unusable / Missing Text: 26 records (59.09%) have no speech or no usable transcript supplied (20 calls: voicemails and unanswered dials B01-B20; 6 meetings: cancelled recordings M05, unscheduled M08, or uncaptured turns M11-M14). In accordance with assessment instructions, zero substantive analysis has been inferred for these records.',
        'Source-Reported Connection Rate: 10 connected calls of 30 total calls (33.33%). Note: this is an upstream system classification; transcript-supported substantive conversation occurred in only 7 of these connected calls (C01, C03, C05, C06, C07, C08, C09, C10), while C02 and C04 were gatekeeper and voicemail interactions.',
        'Staff Roles & Attribution: Telephony records attribute calls to 5 reps (Arun, Leela, Kiran, Meera, Dev). Meeting records attribute calendar invites to 9 organizer emails (team06@example.com through team14@example.com). Organizers are calendar contacts; the data does not establish that an organizer attended or acted as the salesperson.',
      ],
      traceableReferences: [
        { ref: 'B01-B20', note: '20 calls without usable text (voicemail / unanswered)' },
        { ref: 'C01-C10', note: '10 calls with adapted transcripts' },
        { ref: 'M01-M10', note: '8 meetings with usable turns post-update (M01-M04, M06, M07, M09, M10)' },
      ],
    },
    {
      title: '2. Core Conversation Themes Across Usable Interactions',
      badge: 'Strategic Signals',
      content: [
        'Advisory Channel Partnerships (High Potential): Distinct demand from accounting and corporate advisory firms (Harborpath Advisory in M01, Willowbank Advisory in C07, and LedgerBridge in M02) seeking virtual business accounts and automated two-way ERP sync. Advisory firms incorporate client entities and actively seek digital banking referral partners.',
        'ERP Integration & Competitive Displacements: Prospects repeatedly cite incumbent systems (StoreHarbor in C05, proprietary in-house tools in C09, head-office ERP in C06, and NetSuite in M03). Winning requires proving superior automated card approval workflows and seamless two-way ledger reconciliation rather than basic expense capture.',
        'Post-Sale Implementation Friction & Defect Escalation: Onboarding and retention face real operational hurdles: entity workspace invite token failures (Brookmint in M09), fear of month-end close blackout during prepaid-to-credit migration (Cedarwave in M04), and critical production software defects in billing and reimbursement execution (Willowfield Trust in M07).',
      ],
      traceableReferences: [
        { ref: 'M01 turn 1-4', note: 'Harborpath corporate formation account referral model' },
        { ref: 'C07', note: 'Willowbank Advisory digital account partnership inquiry' },
        { ref: 'M07 turn 1-27', note: 'Willowfield Trust billing & reimbursement defect triage' },
        { ref: 'M04 turn 1-16', note: 'Cedarwave month-end migration risk' },
      ],
    },
    {
      title: '3. Practical Coaching for Sales Representatives & Customer Success',
      badge: 'Team Enablement',
      content: [
        'Telephony Profile & Caller Identity Audit (Meera / Ravi in C06): Rep account metadata is labeled "Meera", but the caller verbally introduces himself as "Ravi". Management must immediately verify whether team members are sharing phone logins or if upstream CTI caller IDs are misconfigured.',
        'Respecting Prospect Outreach Boundaries (Vedant / Rishabh in C09): Prospect Vedant provided the name of their central business head (Mr. Rishabh) but explicitly commanded: "No, please don\'t use my name." Coaching point: Reps must respect negative constraints. Inadvertently mentioning Vedant\'s name would breach trust and immediately burn the executive opportunity.',
        'Handling Stale Contact Information (Meadowbrick in C10): Rep Meera contacted Aniket regarding Meadowbrick, learning he had left the company for manufacturing. Reps must update contact CRM records promptly and refrain from pressing for scheduled callbacks when a prospect explicitly states they will reach out if interested.',
        'Rigorous Early Qualification on Compliance Boundaries (M01): Partner A initially assumed SpendNest offers remote accounts for individual overseas residents. Team member A executed textbook compliance boundary setting by confirming SpendNest requires a registered US corporate entity before proceeding into commercial terms.',
      ],
      traceableReferences: [
        { ref: 'C06', note: 'Ravi verbal greeting vs Meera telephony account metadata' },
        { ref: 'C09', note: 'Vedant: "No, please don\'t use my name."' },
        { ref: 'C10', note: 'Aniket: "I don\'t work there anymore... I will contact you if there is anything."' },
        { ref: 'M01 turn 2', note: 'Team member A: "we work with registered businesses, not individuals"' },
      ],
    },
    {
      title: '4. Supported Follow-Up Priorities (Evidence-Backed Next Steps)',
      badge: 'Immediate Execution',
      content: [
        'Priority 1 (Urgent Support Triage): Team member A must deliver the promised 1-2 hour resolution update to Customer A at Willowfield Trust regarding the stuck "Processing" reimbursement queue and file tickets for the description persistence and payment amount caching bugs (M07).',
        'Priority 2 (Commercial Closing): Send customized NetSuite approval hierarchy mapping and card fee proposal to Asterloom Systems finance team (M03).',
        'Priority 3 (Channel Partnership Execution): Send virtual business account commercial overview to Aditya at Willowbank Advisory via messaging app, with a calendar check for Monday (C07); deliver partnership term sheets to Harborpath Advisory (M01).',
        'Priority 4 (Product Evaluation Follow-Up): Kiran to email Milan with agreed subject line "Developer access and event notifications — follow-up" and confirm Monday/Tuesday call to discuss API pricing options (C03).',
        'Priority 5 (Onboarding Resolution): Re-issue valid admin invite token for Brookmint Holdings workspace and clarify parent-subsidiary multi-tenant toggle permissions (M09).',
      ],
      traceableReferences: [
        { ref: 'M07 turn 23', note: '1-2 hour resolution commitment for stuck reimbursement payments' },
        { ref: 'M03 turn 18', note: 'Asterloom NetSuite approval and card pricing follow-up' },
        { ref: 'C07', note: 'Willowbank messaging proposal and Monday call' },
        { ref: 'C03', note: 'Kiran agreed API email follow-up' },
        { ref: 'M09 turn 1-15', note: 'Brookmint Holdings invitation token re-issue' },
      ],
    },
    {
      title: '5. Critical Uncertainties & Missing Information Boundaries',
      badge: 'Evidence Limitations',
      content: [
        'Absence of CRM Opportunity Amounts: No authoritative contract value, pipeline stage, or close probability is supplied in this dataset. Spoken figures (e.g. INR 18,200 in M07) represent transaction defect amounts, not deal values.',
        'Unverified Meeting Attendance: Calendar organizers (team06-team14) cannot be presumed to be sales account executives or meeting attendees. Transcript speakers are labeled generically ("Team member A", "Customer A").',
        'Telephony vs Transcript Disconnect: Stored outcomes in call metadata (e.g., "voicemail" on B01-B20) describe upstream telecom signals. Duration numbers reflect connection time, not substantive conversation length.',
        'Single-Day Slice: All 44 records represent activity on 21 August 2026. This selected sample provides qualitative variety, not an aggregate quarterly performance ranking of sales representatives.',
      ],
      traceableReferences: [
        { ref: 'DATA_DICTIONARY.md', note: 'Definitions of null summaries, shifted dates, and lack of deal table' },
        { ref: 'DATA_CONTRACT.md', note: 'Absence of cross-meeting speaker directory and verified account IDs' },
      ],
    },
  ],
};
