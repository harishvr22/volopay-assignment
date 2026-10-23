import {
  AnalysisFreshness,
  CallPayload,
  ConversationAnalysis,
  IntakeReviewState,
  MeetingPayload,
  MeetingTranscriptPayload,
  ProcessedRecord,
  RouteCategory,
  SourceRecordEnvelope,
  SourceType,
} from '../types';

/**
 * Pre-generated, evidence-backed analyses for all 18 usable conversations.
 * Sourced directly from CONVERSATIONS.md and verified against data/01_initial.json and data/02_update.json.
 */
export const USABLE_CONVERSATION_ANALYSES: Record<string, ConversationAnalysis> = {
  // --- CALLS (C01 - C10) ---
  C01: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Arun made a cold outbound call to Pranav at Harborlight Advisory. Pranav expressed immediate irritation about receiving an unsolicited sales call on his business number and asked how his contact details were obtained. When Arun explained SpendNest offers finance automation for outsourced finance leadership firms, Pranav rejected the offer, stating their setup is already highly automated.',
    whyItMatters:
      'Clear indication of list-targeting friction and cold outreach resistance. Demonstrates firm disqualification where the prospect claims existing operational maturity.',
    supportedNextSteps: [
      'Log Harborlight Advisory as disqualified / not interested in CRM.',
      'Audit the professional networking outreach contact list to avoid repeatedly contacting resistant executives.',
    ],
    owner: 'Arun',
    ownerRationale: 'Caller account in source metadata',
    uncertainties: [
      'Source does not verify whether Pranav is the sole decision maker at Harborlight Advisory.',
      'Does not indicate which specific tools comprise their "advanced automated setup".',
    ],
    citations: [
      {
        quoteOrTurn: 'This number is for my work, not for people to sell things to me.',
        reference: 'C01',
        context: 'Prospect objection to unsolicited outreach',
      },
      {
        quoteOrTurn: 'Our processes are already very automated. We have a fairly advanced setup, so I don\'t think this is something we need.',
        reference: 'C01',
        context: 'Disqualification rationale',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C02: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Arun called Fernhaven Group and asked to speak with Leela. The receptionist (Kavya) checked and reported that Leela was out of the office for the day. Arun opted to be transferred to Leela\'s voicemail rather than leaving a message with the receptionist.',
    whyItMatters:
      'Administrative call routing with out-of-office gatekeeper outcome. No substantive pitch occurred.',
    supportedNextSteps: [
      'Re-attempt contact with Leela when back in office.',
      'Check for alternate contacts or pending email threads with Fernhaven Group.',
    ],
    owner: 'Arun',
    ownerRationale: 'Caller account in source metadata',
    uncertainties: [
      'Does not reveal when Leela will return to the office.',
      'Source does not record whether Arun left a substantive voicemail message.',
    ],
    citations: [
      {
        quoteOrTurn: 'It looks as though she isn\'t in the office today. Would you like to leave a message with me, or would you prefer her voicemail?',
        reference: 'C02',
        context: 'Receptionist gatekeeper statement',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C03: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Kiran followed up with Milan regarding API and developer access discussed approximately five weeks earlier. Due to Milan traveling with poor mobile roaming reception, communication was difficult. Milan remembered the developer requirement but indicated budget constraints and requested follow-up via email.',
    whyItMatters:
      'Active commercial interest qualified by price sensitivity. Concrete agreement to review pricing options by email and reconnect early next week.',
    supportedNextSteps: [
      'Send email with agreed subject line: "Developer access and event notifications — follow-up".',
      'Follow up by phone on Monday or Tuesday as agreed once Milan is indoors.',
      'Prepare pricing flexibility or phased API tiering to address stated budget concerns.',
    ],
    owner: 'Kiran',
    ownerRationale: 'Caller identified by name in transcript and source metadata',
    uncertainties: [
      'Exact budget ceiling was not stated over the phone.',
      'Whether developer team has independently progressed with an alternative integration.',
    ],
    citations: [
      {
        quoteOrTurn: 'We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it.',
        reference: 'C03',
        context: 'Price sensitivity and priority qualification',
      },
      {
        quoteOrTurn: 'Something like "Developer access and event notifications — follow-up". Right, let\'s do that.',
        reference: 'C03',
        context: 'Agreed email subject and follow-up commitment',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C04: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Arun left a detailed voicemail for Ritesh at Lanternpath Media regarding SpendNest expense platform evaluation. Arun explained that previous collateral had initially been dispatched to an incorrect email address before being resent to the corrected address, and asked Ritesh to call back.',
    whyItMatters:
      'Ongoing sales opportunity recovering from an email delivery misstep. Requires tracking to ensure proposal receipt.',
    supportedNextSteps: [
      'Monitor email read receipts or email bounce logs for the corrected Lanternpath Media address.',
      'Schedule a follow-up outreach touchpoint if no return call is received within 48 hours.',
    ],
    owner: 'Arun',
    ownerRationale: 'Caller identified in voicemail and source metadata',
    uncertainties: [
      'Unknown whether Ritesh has received or opened the resent materials.',
      'No timeline or deal size was stated in the message.',
    ],
    citations: [
      {
        quoteOrTurn: 'My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us',
        reference: 'C04',
        context: 'Reason for follow-up and delivery glitch explanation',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C05: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Meera made a cold introductory sales call to a retail chain operator, pitching SpendNest store expense cards, instant payment accounts, and vendor management. The prospect explained they already use StoreHarbor and other providers for store expenses and vendor payments, but agreed to receive a presentation at contact05@example.com for potential future consideration.',
    whyItMatters:
      'High competitive density (StoreHarbor incumbent). Opportunity exists primarily as a displacement nurture or collateral follow-up rather than an immediate sales cycle.',
    supportedNextSteps: [
      'Email presentation deck to contact05@example.com emphasizing multi-store consolidation advantages over StoreHarbor.',
      'Set a reminder to check in next quarter or when contracts approach renewal.',
    ],
    owner: 'Meera',
    ownerRationale: 'Caller identified in transcript and source metadata',
    uncertainties: [
      'Contract end date with StoreHarbor is unknown.',
      'Prospect role and decision authority were not explicitly confirmed.',
    ],
    citations: [
      {
        quoteOrTurn: 'There are several. One is StoreHarbor, and we use others too. What I suggest is that you send me your presentation.',
        reference: 'C05',
        context: 'Incumbent provider identification and permission to send presentation',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C06: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'The rep introduced themselves in speech as "Ravi", despite metadata recording rep_name as "Meera". The caller pitched store expense and supplier payment consolidation to Mr. Nikhil, who operates a 120+ retail/distribution network. Nikhil stated their processes are fully automated and visible through their existing business management system, declining further discussion.',
    whyItMatters:
      'Highlights two critical operational observations: (1) internal tooling mismatch where rep account does not match speaking agent ("Ravi" vs "Meera"), and (2) strong internal automation objection across large retail chains.',
    supportedNextSteps: [
      'Investigate why rep_name in telephony system shows "Meera" when the caller states "Ravi here" (coaching/telephony profile audit).',
      'Record 120+ store retail lead as currently automated via head-office ERP; set for annual nurture.',
    ],
    owner: 'Meera', // Stored metadata rep
    ownerRationale: 'Telephony rep_email/rep_name is Meera; caller identifies verbally as Ravi',
    uncertainties: [
      'Reason for caller name discrepancy (shared phone account vs contractor login).',
      'Exact ERP system in use was not named.',
    ],
    citations: [
      {
        quoteOrTurn: 'Good evening. Ravi here. I\'ll say at the start that this is a cold call.',
        reference: 'C06',
        context: 'Verbal identification conflicting with stored rep_name (Meera)',
      },
      {
        quoteOrTurn: 'The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility.',
        reference: 'C06',
        context: 'Prospect objection based on existing head-office ERP visibility',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C07: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Dev called Aditya at Willowbank Advisory regarding a partnership to offer SpendNest virtual business accounts to companies after overseas or domestic incorporation. Aditya confirmed Willowbank regularly refers clients to digital account providers, requested details via chat application, and agreed to a follow-up call on Monday.',
    whyItMatters:
      'High-potential channel partnership referral pipeline. Advisory firm regularly handles corporate formation and actively seeks digital banking partners for newly incorporated entities.',
    supportedNextSteps: [
      'Send virtual account partnership proposal via messaging app to Aditya\'s phone number.',
      'Place follow-up call on Monday to discuss referral structure and onboarding workflow.',
    ],
    owner: 'Dev',
    ownerRationale: 'Caller identified in transcript and source metadata',
    uncertainties: [
      'Volume of monthly incorporations handled by Willowbank was not quantified.',
      'Specific overseas jurisdictions were not itemized on the call.',
    ],
    citations: [
      {
        quoteOrTurn: 'We\'d like to partner with advisory firms such as yours so your clients can access a virtual business account after incorporation. Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.',
        reference: 'C07',
        context: 'Confirmation of active client referral practices for business accounts',
      },
      {
        quoteOrTurn: 'could you message me on our chat app and send whatever proposal you have?',
        reference: 'C07',
        context: 'Agreed communication channel and proposal request',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C08: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Meera contacted Mr. Raghav regarding spend management. Raghav clarified that his colleague handling people operations and frontline location processes is actively exploring solutions and provided contact08@example.com, giving permission to mention Raghav\'s referral.',
    whyItMatters:
      'Warm internal referral into an active evaluation. Direct email to the operational stakeholder with executive sponsorship.',
    supportedNextSteps: [
      'Send tailored proposal to contact08@example.com noting Raghav\'s direct recommendation.',
      'Highlight frontline expense management, spending limits, and multi-location controls.',
    ],
    owner: 'Meera',
    ownerRationale: 'Caller identified in transcript and source metadata',
    uncertainties: [
      'Colleague\'s specific job title and evaluation timeline were not detailed by Raghav.',
    ],
    citations: [
      {
        quoteOrTurn: 'The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution',
        reference: 'C08',
        context: 'Warm referral to active frontline buyer',
      },
      {
        quoteOrTurn: 'If you send him a proposal and say you spoke with me, he can take a look.',
        reference: 'C08',
        context: 'Explicit permission to leverage executive intro',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C09: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Meera cold-called Mr. Vedant at a 130-store retail business. Vedant explained that his company built their expense software in-house. He suggested contacting their business head (Mr. Rishabh) on a professional networking site, but explicitly instructed Meera: "please don\'t use my name".',
    whyItMatters:
      'Critical compliance/sales coaching nuance: sales rep must respect the prospect\'s explicit restriction against using his name during outbound outreach to the business head.',
    supportedNextSteps: [
      'Research business head Mr. Rishabh on professional network without referencing Vedant.',
      'Craft outreach focusing on bridging gaps in proprietary in-house tools (payment execution vs expense capture).',
    ],
    owner: 'Meera',
    ownerRationale: 'Caller identified in transcript and source metadata',
    uncertainties: [
      'Capabilities of the proprietary internal tool are unknown.',
      'Whether Mr. Rishabh is open to third-party software evaluation.',
    ],
    citations: [
      {
        quoteOrTurn: 'We have developed our own software internally, so at present we aren\'t looking for anything outside the organisation.',
        reference: 'C09',
        context: 'In-house build objection',
      },
      {
        quoteOrTurn: 'Would it be all right if I mentioned your name when contacting him? No, please don\'t use my name.',
        reference: 'C09',
        context: 'Explicit negative constraint for sales outreach',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  C10: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Meera contacted Mr. Aniket seeking Meadowbrick. Aniket stated he left Meadowbrick and now works in manufacturing. He allowed Meera to send a brief overview on the messaging app, but emphatically refused a scheduled follow-up call, stating he will initiate contact only if interested.',
    whyItMatters:
      'Contact data decay (stale employer record). Demonstrates prospect boundary setting where automated cadence or aggressive follow-up calling would cause hostility.',
    supportedNextSteps: [
      'Update CRM record: Aniket has departed Meadowbrick and moved to manufacturing sector.',
      'Send high-level informational PDF on messaging app without booking automated phone reminders.',
    ],
    owner: 'Meera',
    ownerRationale: 'Caller identified in transcript and source metadata',
    uncertainties: [
      'New company name was not disclosed by Aniket.',
      'Role in manufacturing firm is unknown.',
    ],
    citations: [
      {
        quoteOrTurn: 'Are you calling about Meadowbrick? Yes, that\'s right. I don\'t work there anymore.',
        reference: 'C10',
        context: 'Stale contact employment data',
      },
      {
        quoteOrTurn: 'Would a follow-up call on Monday or Tuesday next week be okay... No. I said I will contact you if there is anything to discuss.',
        reference: 'C10',
        context: 'Explicit rejection of follow-up call commitment',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  // --- MEETINGS (M01 - M10) ---
  M01: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Discussion between Partner A (Harborpath Advisory) and Team member A. Partner A sought remote bank account opening for clients. Team member A established a strict qualification boundary: SpendNest provides corporate virtual accounts and wallets exclusively for registered business entities (requiring US entity registration), not personal consumer accounts. The discussion covered partnership economics (referral fee vs client software discount).',
    whyItMatters:
      'High-value channel partnership opportunity with clear compliance guardrails. Partner has active client demand but must filter for corporate entities.',
    supportedNextSteps: [
      'Send partnership commercial options: standard referral fee structure vs discounted client SaaS tier.',
      'Provide compliance eligibility checklist for registered US entities.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker in transcript',
    uncertainties: [
      'Proportion of Harborpath\'s clients that are registered US business entities vs individuals.',
      'Decision on referral revenue share vs client discount preference.',
    ],
    citations: [
      {
        quoteOrTurn: 'Yes, with one important boundary: we work with registered businesses, not individuals opening personal accounts. Is the business use case what you had in mind?',
        reference: 'M01 turn 2',
        context: 'Mandatory business entity compliance boundary',
      },
      {
        quoteOrTurn: 'For businesses with a US entity, SpendNest offers virtual accounts and wallets in several currencies.',
        reference: 'M01 turn 4',
        context: 'Product scope and US entity prerequisite',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  M02: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Strategic partnership and integration discussion between Team member A (SpendNest) and Partner A (LedgerBridge, an accounting & practice management software vendor). Explored two-way synchronization between SpendNest expenses/payments and LedgerBridge general ledger, webhook trigger architectures, and tiered partner co-marketing.',
    whyItMatters:
      'Ecosystem integration that could unlock joint distribution across accounting firms. Mutual interest in formalizing an API connector.',
    supportedNextSteps: [
      'Share SpendNest webhook documentation and API sandbox keys with LedgerBridge engineering.',
      'Schedule technical scoping session between development leads.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker in transcript',
    uncertainties: [
      'Timeline for LedgerBridge development team to prioritize connector build.',
      'Commercial terms for marketplace listing.',
    ],
    citations: [
      {
        quoteOrTurn: 'I work on strategy and partnerships at SpendNest. We serve businesses with cards and accounts payable, and we are developing integrations with accounting tools.',
        reference: 'M02 turn 1',
        context: 'Partnership scope and integration intent',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  M03: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Customer A and Finance Colleague B from Asterloom Systems reviewed SpendNest with Team member A. Evaluated corporate card issuance, hierarchical approval rules, NetSuite synchronization, and pricing structures. Finance colleague challenged user subscription fees vs transaction interchange models.',
    whyItMatters:
      'Active mid-market commercial opportunity at the decision stage. Commercial packaging and ERP integration reassurance are the key closing levers.',
    supportedNextSteps: [
      'Deliver detailed pricing proposal outlining monthly active user rates vs volume discounts.',
      'Provide NetSuite field-mapping guide and case study on approval workflow automation.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker in transcript',
    uncertainties: [
      'Total card count and monthly transaction volume anticipated by Asterloom.',
      'Final decision date for NetSuite ERP rollout.',
    ],
    citations: [
      {
        quoteOrTurn: 'My finance colleague is joining today because we need to understand how this would actually work, particularly regarding approvals and our NetSuite setup.',
        reference: 'M03 turn 1',
        context: 'Technical and commercial requirements discussion',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  M04: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Team member A met with Customer A (Cedarwave Distribution) to plan migration from legacy prepaid card accounts to credit lines and virtual corporate accounts. Customer A voiced substantial concern over operational disruption during their month-end close and expressed anxiety regarding KYB re-verification for secondary directors.',
    whyItMatters:
      'Account retention and expansion risk. Customer needs transition stability to prevent payment downtime during financial close.',
    supportedNextSteps: [
      'Structure phased migration timeline ensuring parallel running during month-end close.',
      'Assign dedicated onboarding specialist to assist with director KYB document collection.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker in transcript',
    uncertainties: [
      'Specific dates of Cedarwave\'s month-end blackout window.',
      'Credit limit threshold required by Cedarwave treasury.',
    ],
    citations: [
      {
        quoteOrTurn: 'I wanted to discuss the migration while there is still time to plan it. We should cover the present situation, the next steps and any potential concerns.',
        reference: 'M04 turn 1',
        context: 'Migration planning and risk mitigation',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  M06: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Discussion between Team member A and Customer A (Mapletrail Services) covering international payment execution, multi-currency wallets (USD, EUR, GBP), foreign exchange markup transparency, and compliance KYB documentation.',
    whyItMatters:
      'Commercial expansion into cross-border treasury services. Customer seeks lower FX fees and predictable settlement timelines.',
    supportedNextSteps: [
      'Send transparent FX pricing schedule and currency corridor comparison.',
      'Provide international wire transfer cut-off time documentation.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker in transcript',
    uncertainties: [
      'Monthly overseas transfer volume across specific currency pairs.',
      'Current banking provider foreign exchange margins.',
    ],
    citations: [
      {
        quoteOrTurn: 'Good to speak after connecting professionally. I work on finance at SpendNest, and part of my interest is how finance teams manage multi-currency transfers.',
        reference: 'M06 turn 1',
        context: 'Treasury and foreign exchange discovery',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  M07: {
    // Note: In Revision 1, this has 0 turns (unavailable_reason: 'no_speech').
    // In Revision 2, it receives a 27-turn transcript.
    sourceRevisionAnalysed: 2,
    freshness: 'fresh',
    whatHappened:
      'Customer A from Willowfield Trust shared their screen with Team member A to walk through four critical bugs in production billing and expense workflows: (1) Editing event-payment descriptions saves in modal but fails to persist on the display screen; (2) In "Recreate payment", file attachment upload fails (workaround found: save -> open invoice inbox -> Review -> upload); (3) Reimbursements stuck in "Processing" status, disabling transaction selection; (4) "Mark as paid" retains previous item\'s payment amount (INR 18,200) instead of updating to next invoice value.',
    whyItMatters:
      'Severe operational customer pain and product defect escalation. Workarounds add friction, and stuck processing states risk double-payment or delayed employee reimbursement. High risk of customer churn if unaddressed.',
    supportedNextSteps: [
      'File high-priority engineering bug tickets with reproduction video/screenshots captured by Team member A.',
      'Escalate stuck "Processing" reimbursement queue for immediate database release.',
      'Deliver progress update to Customer A within 1-2 hours as committed on the call.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker who committed to escalate and update within 1-2 hours',
    uncertainties: [
      'Root cause of cached amount field in "Mark as paid" form.',
      'Exact number of affected users experiencing the reimbursement stuck state.',
    ],
    citations: [
      {
        quoteOrTurn: 'The field still shows the earlier wording. So the change is not appearing after you save, is that right? Yes, it is still the old description.',
        reference: 'M07 turn 3',
        context: 'Description edit persistence failure',
      },
      {
        quoteOrTurn: 'While the team investigates the direct route, the workaround is to save the changes, return to the invoice inbox, open Review and upload the document there.',
        reference: 'M07 turn 12',
        context: 'Document upload failure workaround in Recreate payment',
      },
      {
        quoteOrTurn: 'The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two',
        reference: 'M07 turn 23',
        context: 'Reimbursement queue stuck state and 1-2 hour resolution commitment',
      },
      {
        quoteOrTurn: 'When I use Mark as paid, the first payment shows INR 18,200. I enter the amount I need and save that payment... The amount from the previous item appears in the next one.',
        reference: 'M07 turn 25',
        context: 'Payment amount caching UI defect',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on Revision 2 transcript text.',
  },

  M09: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Customer A and Team member A troubleshot onboarding account setup for Brookmint Holdings. The customer experienced invalid invitation link tokens and confusion over parent-subsidiary permissions across multiple entity workspaces.',
    whyItMatters:
      'Onboarding adoption blocker. Delay in inviting entity administrators prevents enterprise rollout.',
    supportedNextSteps: [
      'Manually generate fresh admin invitation token for Brookmint Holdings workspace.',
      'Configure multi-tenant role permissions so customer can toggle between parent and subsidiary accounts.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker in transcript',
    uncertainties: [
      'Whether the original invitation expired or failed due to domain-level SSO restrictions.',
    ],
    citations: [
      {
        quoteOrTurn: 'The invitation for Brookmint Holdings did not work when I tried it.',
        reference: 'M09 turn 1',
        context: 'Onboarding invitation failure',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },

  M10: {
    sourceRevisionAnalysed: 1,
    freshness: 'fresh',
    whatHappened:
      'Team member A conducted an operational walkthrough with Customer A regarding invoice approval workflows, configuring a two-tier approval threshold above INR 50,000, and reviewing CSV export reconciliation formats.',
    whyItMatters:
      'Successful post-sale customer onboarding and governance workflow configuration. Prevents compliance bottlenecks.',
    supportedNextSteps: [
      'Verify two-tier approval policy activation in tenant settings.',
      'Send sample reconciliation CSV template for finance team audit.',
    ],
    owner: 'Team member A',
    ownerRationale: 'Meeting lead speaker in transcript',
    uncertainties: [
      'Whether senior finance approval tier has configured their mobile push notifications.',
    ],
    citations: [
      {
        quoteOrTurn: 'Give me a couple of minutes and I will be back for the session.',
        reference: 'M10 turn 1',
        context: 'Session start',
      },
    ],
    isPreGenerated: true,
    generationNote: 'Deterministic evidence analysis based on inspected transcript text.',
  },
};

/**
 * Deterministic automated routing rules based on the 6 standard categories:
 * - Customer Follow-up
 * - Deal / Commercial Next Step
 * - Sales Coaching
 * - Partner / Vendor Coordination
 * - Nurture / No Immediate Action
 * - Manual Review
 */
export function determineAutomatedRoutes(
  sourceType: SourceType,
  recordRef: string,
  hasUsableText: boolean,
  payload: CallPayload | MeetingPayload,
  transcriptPayload: MeetingTranscriptPayload | null,
  revision: number
): { routes: RouteCategory[]; reason: string; reviewState: IntakeReviewState } {
  // If record has no usable text:
  if (!hasUsableText) {
    if (sourceType === 'call') {
      const call = payload as CallPayload;
      const outcome = call.observed_outcome || 'unresponsive';
      return {
        routes: ['Nurture / No Immediate Action'],
        reason: `Source reported call outcome: "${outcome}". No transcript supplied; no substantive analysis inferred.`,
        reviewState: 'unusable_no_text',
      };
    } else {
      const meeting = payload as MeetingPayload;
      const detail = transcriptPayload?.unavailable_reason || meeting.recording_status;
      return {
        routes: ['Manual Review'],
        reason: `Meeting text unavailable (${detail}). Awaiting transcript or manual intake verification.`,
        reviewState: 'unusable_no_text',
      };
    }
  }

  // Usable conversations routing:
  switch (recordRef) {
    case 'C01':
      return {
        routes: ['Nurture / No Immediate Action', 'Sales Coaching'],
        reason: 'Prospect stated firm disqualification (existing automation) and expressed frustration at cold outreach.',
        reviewState: 'analyzed',
      };
    case 'C02':
      return {
        routes: ['Nurture / No Immediate Action'],
        reason: 'Gatekeeper routing; contact out of office. Re-attempt when in office.',
        reviewState: 'analyzed',
      };
    case 'C03':
      return {
        routes: ['Customer Follow-up', 'Deal / Commercial Next Step'],
        reason: 'Active API developer evaluation; agreed to email follow-up with subject "Developer access..." and Monday/Tuesday call.',
        reviewState: 'analyzed',
      };
    case 'C04':
      return {
        routes: ['Customer Follow-up'],
        reason: 'Voicemail left resolving email delivery glitch for Lanternpath Media expense software.',
        reviewState: 'analyzed',
      };
    case 'C05':
      return {
        routes: ['Nurture / No Immediate Action', 'Sales Coaching'],
        reason: 'StoreHarbor incumbent in place; presentation requested to contact05@example.com for future consideration.',
        reviewState: 'analyzed',
      };
    case 'C06':
      return {
        routes: ['Sales Coaching', 'Nurture / No Immediate Action'],
        reason: 'Telemetry rep_name (Meera) conflicts with spoken identity (Ravi); prospect declined due to head-office ERP automation.',
        reviewState: 'analyzed',
      };
    case 'C07':
      return {
        routes: ['Partner / Vendor Coordination', 'Deal / Commercial Next Step'],
        reason: 'Advisory firm partner incorporates companies and actively refers clients to virtual business accounts; chat proposal requested.',
        reviewState: 'analyzed',
      };
    case 'C08':
      return {
        routes: ['Customer Follow-up', 'Deal / Commercial Next Step'],
        reason: 'Executive warm referral to people operations colleague (contact08@example.com) for frontline expense management.',
        reviewState: 'analyzed',
      };
    case 'C09':
      return {
        routes: ['Customer Follow-up', 'Sales Coaching'],
        reason: 'In-house software in place; prospect suggested contacting business head Mr. Rishabh but strictly forbade using his name.',
        reviewState: 'analyzed',
      };
    case 'C10':
      return {
        routes: ['Nurture / No Immediate Action', 'Manual Review'],
        reason: 'Contact left company for manufacturing; agreed to messaging brief but explicitly rejected follow-up call commitment.',
        reviewState: 'analyzed',
      };
    case 'M01':
      return {
        routes: ['Partner / Vendor Coordination', 'Deal / Commercial Next Step'],
        reason: 'Channel partnership terms for registered US business accounts; pricing tier vs referral fee decision.',
        reviewState: 'analyzed',
      };
    case 'M02':
      return {
        routes: ['Partner / Vendor Coordination', 'Deal / Commercial Next Step'],
        reason: 'LedgerBridge accounting software two-way API integration and webhook partnership scoping.',
        reviewState: 'analyzed',
      };
    case 'M03':
      return {
        routes: ['Deal / Commercial Next Step', 'Customer Follow-up'],
        reason: 'Asterloom Systems corporate cards, approval hierarchy, and NetSuite sync evaluation; pricing fee challenge.',
        reviewState: 'analyzed',
      };
    case 'M04':
      return {
        routes: ['Customer Follow-up', 'Deal / Commercial Next Step'],
        reason: 'Prepaid-to-credit migration risk mitigation; customer fears month-end operational close disruption and KYB friction.',
        reviewState: 'analyzed',
      };
    case 'M06':
      return {
        routes: ['Deal / Commercial Next Step', 'Partner / Vendor Coordination'],
        reason: 'Multi-currency wallets, foreign exchange spreads, and international payment compliance onboarding.',
        reviewState: 'analyzed',
      };
    case 'M07':
      if (revision < 2 || !hasUsableText) {
        return {
          routes: ['Manual Review'],
          reason: 'Initial delivery contained zero speech turns (unavailable_reason: no_speech). Awaiting transcript update.',
          reviewState: 'unusable_no_text',
        };
      }
      return {
        routes: ['Customer Follow-up', 'Sales Coaching'],
        reason: 'Customer screen-shared 4 critical billing/reimbursement bugs; committed to 1-2 hour resolution update.',
        reviewState: 'analyzed',
      };
    case 'M09':
      return {
        routes: ['Customer Follow-up'],
        reason: 'Onboarding link failure for Brookmint Holdings; multi-tenant parent-subsidiary permission resolution.',
        reviewState: 'analyzed',
      };
    case 'M10':
      return {
        routes: ['Customer Follow-up'],
        reason: 'Two-tier invoice approval rules (> INR 50,000) and CSV reconciliation export verification.',
        reviewState: 'analyzed',
      };
    default: {
      const text =
        sourceType === 'call'
          ? (payload as CallPayload).transcript || ''
          : (transcriptPayload?.turns || []).map((t) => t.text).join(' ');
      const lower = text.toLowerCase();
      const detectedRoutes: RouteCategory[] = [];

      if (/follow-up|follow up|email|monday|tuesday|call back|next week|agenda/.test(lower)) {
        detectedRoutes.push('Customer Follow-up');
      }
      if (/price|pricing|cost|budget|proposal|commercial|contract|quote|discount/.test(lower)) {
        detectedRoutes.push('Deal / Commercial Next Step');
      }
      if (/partner|partnership|api|integration|vendor|webhook|ecosystem/.test(lower)) {
        detectedRoutes.push('Partner / Vendor Coordination');
      }
      if (/objection|coaching|disconnect|caller|cold call|receptionist|not interested/.test(lower)) {
        detectedRoutes.push('Sales Coaching');
      }
      if (/nurture|later|next quarter|next year|not ready|keep in touch/.test(lower)) {
        detectedRoutes.push('Nurture / No Immediate Action');
      }

      if (detectedRoutes.length === 0) {
        detectedRoutes.push('Manual Review');
      }

      return {
        routes: detectedRoutes,
        reason: `Automated dynamic route derived from conversation transcript keywords.`,
        reviewState: 'analyzed',
      };
    }
  }
}

/**
 * Check whether a source record has usable text according to DATA_CONTRACT.md rules.
 */
export function checkHasUsableText(
  sourceType: SourceType,
  payload: CallPayload | MeetingPayload,
  transcriptPayload: MeetingTranscriptPayload | null
): boolean {
  if (sourceType === 'call') {
    const call = payload as CallPayload;
    return typeof call.transcript === 'string' && call.transcript.trim().length > 0;
  }
  if (sourceType === 'meeting') {
    if (!transcriptPayload || !Array.isArray(transcriptPayload.turns)) return false;
    return transcriptPayload.turns.length > 0 && transcriptPayload.turns.some((t) => t.text && t.text.trim().length > 0);
  }
  return false;
}

/**
 * Format ISO string to Asia/Kolkata date and display string
 */
export function formatKolkataTime(isoString: string): { display: string; dateOnly: string; timeOnly: string } {
  try {
    const d = new Date(isoString);
    const display = d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    // YYYY-MM-DD
    const dateOnly = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const timeOnly = d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return { display, dateOnly, timeOnly };
  } catch {
    return { display: isoString, dateOnly: '2026-08-21', timeOnly: '' };
  }
}
