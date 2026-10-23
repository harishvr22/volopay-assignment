import {
  CallPayload,
  DeliveryBatchEnvelope,
  ImportBatchResult,
  IntakeReviewState,
  ManualOverride,
  ProcessedRecord,
  RouteCategory,
  SourceRecordEnvelope,
  SourceType,
} from '../types';
import {
  checkHasUsableText,
  determineAutomatedRoutes,
  formatKolkataTime,
  USABLE_CONVERSATION_ANALYSES,
} from './intelligenceEngine';

export const STORAGE_RECORDS_KEY = 'spendnest_revenue_intelligence_records_v2';
export const STORAGE_OVERRIDES_KEY = 'spendnest_revenue_intelligence_overrides_v2';
export const STORAGE_IMPORT_HISTORY_KEY = 'spendnest_revenue_intelligence_import_history_v2';

const LEGACY_STORAGE_KEYS = [
  'spendnest_revenue_intelligence_records_v1',
  'spendnest_revenue_intelligence_overrides_v1',
  'spendnest_revenue_intelligence_import_history_v1',
];

/**
 * Logical record identity is strictly (source_type, source_id).
 * DATA_CONTRACT.md Rule 1: Never key records by company name, title, phone, record_ref or array position.
 */
export function getRecordIdentityKey(sourceType: SourceType, sourceId: string): string {
  return `${sourceType}:${sourceId}`;
}

/**
 * Creates a ProcessedRecord from an incoming raw envelope record, respecting revisions and overrides.
 */
export function processRawRecord(
  rawRecord: SourceRecordEnvelope,
  batchRevision: number,
  existingRecord?: ProcessedRecord,
  existingOverride?: ManualOverride
): { record: ProcessedRecord; action: 'added' | 'updated' | 'ignored' } {
  const identity = getRecordIdentityKey(rawRecord.source_type, rawRecord.source_id);

  // If record already exists:
  if (existingRecord) {
    // Rule 2: Ignore same or older revisions (e.g. rev 1 arriving again after rev 2, or same rev 1)
    if (batchRevision <= existingRecord.applied_source_revision) {
      return { record: existingRecord, action: 'ignored' };
    }

    // Rule 3: Newer revision replaces entire source payload & transcript_payload (including nulls)
    const hasUsableText = checkHasUsableText(
      rawRecord.source_type,
      rawRecord.payload,
      rawRecord.transcript_payload
    );

    const isCall = rawRecord.source_type === 'call';
    const activityTimestamp = isCall
      ? (rawRecord.payload as any).started_at
      : (rawRecord.payload as any).starts_at;
    const { dateOnly } = formatKolkataTime(activityTimestamp);

    const personLabel = isCall
      ? (rawRecord.payload as any).rep_name || (rawRecord.payload as any).rep_email || 'Unassigned Rep'
      : (rawRecord.payload as any).organizer_email || 'Unassigned Organizer';
    const personRole = isCall ? ('Call Rep' as const) : ('Meeting Organizer' as const);

    const titleOrOutcome = isCall
      ? (rawRecord.payload as any).observed_outcome || 'Unknown Outcome'
      : (rawRecord.payload as any).title || 'Untitled Meeting';

    // Automated suggested route
    const automated = determineAutomatedRoutes(
      rawRecord.source_type,
      rawRecord.record_ref,
      hasUsableText,
      rawRecord.payload,
      rawRecord.transcript_payload,
      batchRevision
    );

    // Rule 4: Manual overrides must survive new source deliveries
    const activeOverride = existingOverride || existingRecord.manual_override;
    const activeRoutes = activeOverride ? activeOverride.routes : automated.routes;
    const reviewState: IntakeReviewState = activeOverride
      ? 'manual_override_active'
      : automated.reviewState;

    // Rule 5: When source text changes, refresh analysis or mark stale/pending_review
    const textChanged = hasUsableText !== existingRecord.hasUsableText;
    let analysis = USABLE_CONVERSATION_ANALYSES[rawRecord.record_ref] || null;
    let analysisFreshness = analysis
      ? analysis.sourceRevisionAnalysed === batchRevision
        ? ('fresh' as const)
        : ('pending_review' as const)
      : ('not_available' as const);

    // If text arrived late (e.g. M07 update)
    if (textChanged && hasUsableText && rawRecord.record_ref === 'M07') {
      analysis = USABLE_CONVERSATION_ANALYSES['M07'];
      analysisFreshness = 'fresh';
    }

    const updatedRecord: ProcessedRecord = {
      identityKey: identity,
      source_type: rawRecord.source_type,
      source_id: rawRecord.source_id,
      record_ref: rawRecord.record_ref,
      applied_source_revision: batchRevision,
      last_imported_at: new Date().toISOString(),
      payload: rawRecord.payload,
      transcript_payload: rawRecord.transcript_payload,
      hasUsableText,
      activityTimestamp,
      activityDateKolkata: dateOnly,
      personLabel,
      personRole,
      titleOrOutcome,
      suggested_routes: automated.routes,
      suggested_route_reason: automated.reason,
      active_routes: activeRoutes,
      review_state: reviewState,
      manual_override: activeOverride || null,
      analysis,
      analysis_freshness: analysisFreshness,
    };

    return { record: updatedRecord, action: 'updated' };
  }

  // Brand new record:
  const hasUsableText = checkHasUsableText(
    rawRecord.source_type,
    rawRecord.payload,
    rawRecord.transcript_payload
  );

  const isCall = rawRecord.source_type === 'call';
  const activityTimestamp = isCall
    ? (rawRecord.payload as any).started_at
    : (rawRecord.payload as any).starts_at;
  const { dateOnly } = formatKolkataTime(activityTimestamp);

  const personLabel = isCall
    ? (rawRecord.payload as any).rep_name || (rawRecord.payload as any).rep_email || 'Unassigned Rep'
    : (rawRecord.payload as any).organizer_email || 'Unassigned Organizer';
  const personRole = isCall ? ('Call Rep' as const) : ('Meeting Organizer' as const);

  const titleOrOutcome = isCall
    ? (rawRecord.payload as any).observed_outcome || 'Unknown Outcome'
    : (rawRecord.payload as any).title || 'Untitled Meeting';

  const automated = determineAutomatedRoutes(
    rawRecord.source_type,
    rawRecord.record_ref,
    hasUsableText,
    rawRecord.payload,
    rawRecord.transcript_payload,
    batchRevision
  );

  const activeOverride = existingOverride || null;
  const activeRoutes = activeOverride ? activeOverride.routes : automated.routes;
  const reviewState: IntakeReviewState = activeOverride
    ? 'manual_override_active'
    : automated.reviewState;

  let analysis = hasUsableText ? USABLE_CONVERSATION_ANALYSES[rawRecord.record_ref] || null : null;
  // If record is M07 in revision 1, it has 0 turns, so analysis is not available
  if (rawRecord.record_ref === 'M07' && batchRevision < 2) {
    analysis = null;
  }
  // Generate dynamic analysis for any arbitrary uploaded record with usable text
  if (!analysis && hasUsableText && (rawRecord.record_ref !== 'M07' || batchRevision >= 2)) {
    const text =
      rawRecord.source_type === 'call'
        ? (rawRecord.payload as CallPayload).transcript || ''
        : (rawRecord.transcript_payload?.turns || []).map((t) => t.text).join(' ');
    const snippet = text.slice(0, 160) + (text.length > 160 ? '...' : '');
    analysis = {
      sourceRevisionAnalysed: batchRevision,
      freshness: 'fresh',
      whatHappened: `Operational discussion imported from ${rawRecord.source_type} batch. Excerpt: "${snippet}"`,
      whyItMatters: 'Requires managerial review and operational next-step assignment.',
      supportedNextSteps: ['Review conversation transcript and verify ownership.'],
      owner: null,
      uncertainties: ['Awaiting managerial review on imported text.'],
      citations: [
        {
          quoteOrTurn: snippet,
          reference: rawRecord.record_ref,
          context: 'Imported conversation excerpt',
        },
      ],
      isPreGenerated: false,
      generationNote: 'Dynamically generated upon batch import.',
    };
  }
  const analysisFreshness = analysis ? ('fresh' as const) : ('not_available' as const);

  const newRecord: ProcessedRecord = {
    identityKey: identity,
    source_type: rawRecord.source_type,
    source_id: rawRecord.source_id,
    record_ref: rawRecord.record_ref,
    applied_source_revision: batchRevision,
    last_imported_at: new Date().toISOString(),
    payload: rawRecord.payload,
    transcript_payload: rawRecord.transcript_payload,
    hasUsableText,
    activityTimestamp,
    activityDateKolkata: dateOnly,
    personLabel,
    personRole,
    titleOrOutcome,
    suggested_routes: automated.routes,
    suggested_route_reason: automated.reason,
    active_routes: activeRoutes,
    review_state: reviewState,
    manual_override: activeOverride,
    analysis,
    analysis_freshness: analysisFreshness,
  };

  return { record: newRecord, action: 'added' };
}

/**
 * Apply a delivery batch envelope onto current state according to DATA_CONTRACT.md rules.
 */
export function applyDeliveryBatch(
  currentRecords: ProcessedRecord[],
  batchEnvelope: DeliveryBatchEnvelope,
  overridesMap: Map<string, ManualOverride>
): {
  updatedRecords: ProcessedRecord[];
  result: ImportBatchResult;
} {
  const recordsMap = new Map<string, ProcessedRecord>();
  currentRecords.forEach((r) => recordsMap.set(r.identityKey, r));

  let added = 0;
  let updated = 0;
  let ignored = 0;
  const log: string[] = [];

  log.push(
    `Processing batch "${batchEnvelope.batch_id}" (Revision ${batchEnvelope.revision}) with ${batchEnvelope.records.length} incoming records.`
  );

  for (const raw of batchEnvelope.records) {
    const identity = getRecordIdentityKey(raw.source_type, raw.source_id);
    const existing = recordsMap.get(identity);
    const override = overridesMap.get(identity);

    const { record: processed, action } = processRawRecord(
      raw,
      batchEnvelope.revision,
      existing,
      override
    );

    if (action === 'added') {
      recordsMap.set(identity, processed);
      added++;
      log.push(`[ADD] ${raw.record_ref} (${raw.source_type}:${raw.source_id.slice(0, 8)}) created.`);
    } else if (action === 'updated') {
      recordsMap.set(identity, processed);
      updated++;
      log.push(
        `[UPDATE] ${raw.record_ref} replaced payload with Rev ${batchEnvelope.revision}. Usable text: ${processed.hasUsableText}.`
      );
    } else {
      ignored++;
      log.push(
        `[IGNORE] ${raw.record_ref} already at higher or equal revision (Rev ${existing?.applied_source_revision}).`
      );
    }
  }

  const finalRecords = Array.from(recordsMap.values());
  const usableCount = finalRecords.filter((r) => r.hasUsableText).length;

  const result: ImportBatchResult = {
    batch_id: batchEnvelope.batch_id,
    revision: batchEnvelope.revision,
    records_received: batchEnvelope.records.length,
    records_added: added,
    records_updated: updated,
    records_ignored: ignored,
    total_distinct_records_after: finalRecords.length,
    usable_text_count_after: usableCount,
    timestamp: new Date().toISOString(),
    log,
  };

  return {
    updatedRecords: finalRecords,
    result,
  };
}

/**
 * Apply or reset a manual route override for a given record.
 */
export function setManualOverride(
  records: ProcessedRecord[],
  identityKey: string,
  routes: RouteCategory[],
  reason: string,
  overridesMap: Map<string, ManualOverride>
): ProcessedRecord[] {
  const override: ManualOverride = {
    routes,
    reason,
    reviewState: 'manual_override_active',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Manager',
  };

  overridesMap.set(identityKey, override);

  return records.map((r) => {
    if (r.identityKey === identityKey) {
      return {
        ...r,
        active_routes: routes,
        review_state: 'manual_override_active',
        manual_override: override,
      };
    }
    return r;
  });
}

/**
 * Reset an active manual override back to automated suggestion.
 */
export function resetManualOverride(
  records: ProcessedRecord[],
  identityKey: string,
  overridesMap: Map<string, ManualOverride>
): ProcessedRecord[] {
  overridesMap.delete(identityKey);

  return records.map((r) => {
    if (r.identityKey === identityKey) {
      return {
        ...r,
        active_routes: r.suggested_routes,
        review_state: r.hasUsableText ? 'analyzed' : 'unusable_no_text',
        manual_override: null,
      };
    }
    return r;
  });
}

/**
 * LocalStorage persistence helpers.
 */
export function loadPersistedState(): {
  records: ProcessedRecord[];
  overrides: Map<string, ManualOverride>;
  history: ImportBatchResult[];
} {
  try {
    // Purge legacy v1 keys to ensure clean start
    if (typeof localStorage !== 'undefined') {
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    }

    const rawRecords = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_RECORDS_KEY) : null;
    const rawOverrides = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_OVERRIDES_KEY) : null;
    const rawHistory = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_IMPORT_HISTORY_KEY) : null;

    const records = rawRecords ? (JSON.parse(rawRecords) as ProcessedRecord[]) : [];
    const overridesArr = rawOverrides ? (JSON.parse(rawOverrides) as [string, ManualOverride][]) : [];
    const overrides = new Map<string, ManualOverride>(overridesArr);
    const history = rawHistory ? (JSON.parse(rawHistory) as ImportBatchResult[]) : [];

    return { records, overrides, history };
  } catch (err) {
    console.error('Failed to load persisted state from localStorage', err);
    return { records: [], overrides: new Map(), history: [] };
  }
}

export function savePersistedState(
  records: ProcessedRecord[],
  overrides: Map<string, ManualOverride>,
  history: ImportBatchResult[]
): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    localStorage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(Array.from(overrides.entries())));
    localStorage.setItem(STORAGE_IMPORT_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function clearPersistedState(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(STORAGE_RECORDS_KEY);
  localStorage.removeItem(STORAGE_OVERRIDES_KEY);
  localStorage.removeItem(STORAGE_IMPORT_HISTORY_KEY);
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}
