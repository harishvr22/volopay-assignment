export interface EvidenceFinding {
  id: string;
  title: string;
  observation: string;
  sourceReference: string;
  passageQuote: string;
  productDecision: string;
  reflectedIn: string;
}

export interface RejectedDecision {
  title: string;
  rejectedAlternative: string;
  whyRejected: string;
  tradeOffAccepted: string;
  reflectedIn: string;
}

export const EVIDENCE_FINDINGS: EvidenceFinding[] = [
  {
    id: 'finding-1',
    title: 'Post-Sale Defect Escalation in Triage Meeting (M07) vs Pipeline Tracking',
    observation:
      'Customer A from Willowfield Trust demonstrated four severe billing and reimbursement bugs on screen: payment description edit failing to persist upon save, document attachment upload failing in the "Recreate payment" path, reimbursement payments stuck in "Processing" state, and cached payment amounts (INR 18,200) carrying over to the next transaction.',
    sourceReference: 'Meeting M07, Turns 3, 12, 23, and 25',
    passageQuote:
      'Turn 3: "The field still shows the earlier wording. So the change is not appearing after you save, is that right? Yes, it is still the old description." | Turn 23: "The payments appear to have been released but are stuck showing Processing... I expect an update or resolution in an hour or two" | Turn 25: "When I use Mark as paid, the first payment shows INR 18,200... The amount from the previous item appears in the next one."',
    productDecision:
      'Built a multi-route model pairing Customer Follow-up with Sales Coaching / Engineering Escalation. Designed the data contract so that late-arriving transcripts (Revision 2) refresh analysis without overwriting the manager\'s explicit manual route.',
    reflectedIn:
      'ConversationDetail view (freshness badge, 4-defect analysis), Inbox status badge, exports/analysis/M07_analysis.md, and automated test suite.',
  },
  {
    id: 'finding-2',
    title: 'Discrepancy Between Telephony Metadata and Spoken Caller Identity (C06)',
    observation:
      'The call record metadata assigned rep_name as "Meera" (rep_email: meera@example.com), but the actual representative explicitly introduced himself in the transcript as "Ravi here. I\'ll say at the start that this is a cold call."',
    sourceReference: 'Call C06, Short exact quote',
    passageQuote:
      '"Good evening, Mr Nikhil. Good evening. Ravi here. I\'ll say at the start that this is a cold call."',
    productDecision:
      'Refrained from treating upstream metadata as verified truth. Displayed both stored rep metadata and verified transcript citations side-by-side, adding a Sales Coaching route to flag telephony profile mismatches and shared credential risks.',
    reflectedIn:
      'Dashboard (rep attribution disclaimer), Inbox discrepancy flag, ConversationDetail coaching panel, and exports/analysis/C06_analysis.md.',
  },
  {
    id: 'finding-3',
    title: 'Strict Regulatory Compliance Boundary in Partner Discovery (M01)',
    observation:
      'Harborpath Advisory sought remote bank account opening for foreign clients. SpendNest team member A immediately established an essential qualification boundary: accounts are offered exclusively to registered corporate entities with a US presence, not individual consumers.',
    sourceReference: 'Meeting M01, Turns 2 and 4',
    passageQuote:
      'Turn 2: "Yes, with one important boundary: we work with registered businesses, not individuals opening personal accounts. Is the business use case what you had in mind?" | Turn 4: "For businesses with a US entity, SpendNest offers virtual accounts and wallets in several currencies."',
    productDecision:
      'Separated Partner / Vendor Coordination from direct customer sales routing. Created explicit qualification checklists in the conversation detail panel to prevent partner teams from pitching unviable prospects.',
    reflectedIn:
      'Inbox route filter, ConversationDetail compliance boundary panel, exports/manifest.json, and exports/analysis/M01_analysis.md.',
  },
];

export const REJECTED_DECISION: RejectedDecision = {
  title: 'Deliberately Rejecting Automated Pipeline Currency Totaling & Win-Rate Forecasting',
  rejectedAlternative:
    'Synthesizing synthetic deal values, opportunity stages, and weighted revenue forecasts from spoken conversational numbers (such as Asterloom\'s card counts, M07\'s INR 18,200 bug amount, or retail store counts).',
  whyRejected:
    'DATA_DICTIONARY.md explicitly prohibits inventing revenue, deal values, or staff directories: "Monetary amounts within conversation text keep their stated units; no comparable opportunity-value table is supplied." Conversational numbers often represent software defects or speculative questions, not verified pipeline commitments.',
  tradeOffAccepted:
    'The workspace provides no speculative revenue forecasting or pipeline charts, choosing instead 100% verifiable operational intelligence: activity counts, usable transcript coverage, and evidence-backed next steps.',
  reflectedIn:
    'Manager Dashboard (strict operational denominators without fake revenue totals), Definitions modal, and exports/brief/manager_brief_2026-08-21.md.',
};
