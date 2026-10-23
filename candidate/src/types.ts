// Type definitions strictly grounded in DATA_CONTRACT.md and DATA_DICTIONARY.md

export type SourceType = 'call' | 'meeting';

export type RouteCategory =
  | 'Customer Follow-up'
  | 'Deal / Commercial Next Step'
  | 'Sales Coaching'
  | 'Partner / Vendor Coordination'
  | 'Nurture / No Immediate Action'
  | 'Manual Review';

export type AnalysisFreshness = 'fresh' | 'stale' | 'pending_review' | 'not_available';

export type IntakeReviewState =
  | 'analyzed'
  | 'needs_review'
  | 'pending_review'
  | 'unusable_no_text'
  | 'manual_override_active';

export interface CallPayload {
  id: string;
  external_call_id: string;
  workspace_slug: string;
  rep_email: string | null;
  rep_name: string | null;
  rep_user_id: string | null;
  direction: 'inbound' | 'outbound' | string;
  direction_raw: string;
  from_number: string | null;
  to_number: string | null;
  started_at: string; // ISO
  duration_seconds: number;
  talk_time_seconds: number | null;
  speaker_count: number | null;
  segment_count: number | null;
  is_connected: boolean | null;
  is_conversation: boolean | null;
  observed_outcome: string | null;
  classification_reason: null;
  classification_status: string | null;
  is_campaign_call: boolean | null;
  first_dial_ever: boolean | null;
  first_connect_ever: boolean | null;
  prior_dials_ever: number | null;
  prior_connects_ever: number | null;
  summary: null;
  summary_status: string | null;
  transcript: string | null;
}

export interface MeetingTurn {
  speaker: string;
  starts_at_seconds: number;
  timecode: string;
  text: string;
}

export interface MeetingTranscriptPayload {
  meeting_id: string;
  turns: MeetingTurn[];
  unavailable_reason: string | null;
}

export interface MeetingPayload {
  id: string;
  title: string;
  starts_at: string; // ISO
  ends_at: string; // ISO
  duration_seconds: number;
  provider: string;
  join_url: string;
  organizer_email: string | null;
  attendee_count: number | null;
  recording_status: 'recorded' | 'cancelled' | 'not_scheduled' | string;
  recording_detail: string | null;
  recording_id: string | null;
  has_transcript: boolean;
  has_video: boolean;
  summary: null;
  summary_status: string | null;
  redacted: boolean;
}

export interface SourceRecordEnvelope {
  record_ref: string;
  source_type: SourceType;
  source_id: string;
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscriptPayload | null;
}

export interface DeliveryBatchEnvelope {
  batch_id: string;
  revision: number;
  exported_at: string;
  records: SourceRecordEnvelope[];
}

export interface ConversationCitation {
  quoteOrTurn: string;
  reference: string; // "C01" or "M07 turn 12"
  context?: string;
}

export interface ConversationAnalysis {
  sourceRevisionAnalysed: number;
  freshness: AnalysisFreshness;
  whatHappened: string;
  whyItMatters: string;
  supportedNextSteps: string[];
  owner: string | null; // Only if stated in source
  ownerRationale?: string;
  uncertainties: string[];
  citations: ConversationCitation[];
  isPreGenerated: boolean;
  generationNote: string;
}

export interface ManualOverride {
  routes: RouteCategory[];
  reason: string;
  reviewState: IntakeReviewState;
  updatedAt: string;
  updatedBy: string;
}

export interface ProcessedRecord {
  // Identity: (source_type, source_id)
  identityKey: string; // `${source_type}:${source_id}`
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  
  // Revisions & Timestamps
  applied_source_revision: number;
  last_imported_at: string;
  
  // Payloads
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscriptPayload | null;
  
  // Derived metadata
  hasUsableText: boolean;
  activityTimestamp: string; // started_at for calls, starts_at for meetings
  activityDateKolkata: string; // YYYY-MM-DD in Asia/Kolkata
  personLabel: string; // Rep Name / Email for calls, Organizer Email for meetings
  personRole: 'Call Rep' | 'Meeting Organizer';
  titleOrOutcome: string;
  
  // Routing & Intelligence
  suggested_routes: RouteCategory[];
  suggested_route_reason: string;
  active_routes: RouteCategory[];
  review_state: IntakeReviewState;
  manual_override: ManualOverride | null;
  
  // Analysis
  analysis: ConversationAnalysis | null;
  analysis_freshness: AnalysisFreshness;
}

export interface ImportBatchResult {
  batch_id: string;
  revision: number;
  records_received: number;
  records_added: number;
  records_updated: number;
  records_ignored: number;
  total_distinct_records_after: number;
  usable_text_count_after: number;
  timestamp: string;
  log: string[];
}

export interface ManifestEntry {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_source_revision: number;
  routes: string; // Comma-separated
  output_paths: string; // Relative paths separated by semicolon
  processing_review_state: IntakeReviewState;
  manual_override_flag: boolean;
  analysis_freshness: AnalysisFreshness;
  source_revision_analysed: number | null;
}
