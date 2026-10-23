import { describe, expect, it } from 'vitest';
import {
  applyDeliveryBatch,
  getRecordIdentityKey,
  resetManualOverride,
  setManualOverride,
} from '../lib/dataContract';
import {
  checkHasUsableText,
  formatKolkataTime,
} from '../lib/intelligenceEngine';
import {
  buildCompleteExportArchive,
  generateManifestEntries,
} from '../lib/exportArchive';
import { DeliveryBatchEnvelope, ManualOverride, RouteCategory } from '../types';
import initialBatchJson from '../../data/01_initial.json';
import updateBatchJson from '../../data/02_update.json';

const initialBatch = initialBatchJson as DeliveryBatchEnvelope;
const updateBatch = updateBatchJson as DeliveryBatchEnvelope;

describe('Revenue Intelligence Data Contract & Behavior Tests', () => {
  // Test 1: Initial import yields 44 distinct records and 17 usable texts
  it('1. Initial import yields exactly 44 distinct records and 17 usable texts', () => {
    const overrides = new Map<string, ManualOverride>();
    const { updatedRecords, result } = applyDeliveryBatch([], initialBatch, overrides);

    expect(result.total_distinct_records_after).toBe(44);
    expect(updatedRecords.length).toBe(44);
    expect(result.records_added).toBe(44);
    expect(result.records_updated).toBe(0);
    expect(result.records_ignored).toBe(0);

    const usableRecords = updatedRecords.filter((r) => r.hasUsableText);
    expect(usableRecords.length).toBe(17);
    expect(result.usable_text_count_after).toBe(17);

    // Verify M07 has 0 turns initially
    const m07 = updatedRecords.find((r) => r.record_ref === 'M07')!;
    expect(m07).toBeDefined();
    expect(m07.applied_source_revision).toBe(1);
    expect(m07.hasUsableText).toBe(false);
  });

  // Test 2: Reimporting revision 1 does not duplicate records
  it('2. Reimporting revision 1 does not duplicate records or inflate counts', () => {
    const overrides = new Map<string, ManualOverride>();
    const firstImport = applyDeliveryBatch([], initialBatch, overrides);
    expect(firstImport.updatedRecords.length).toBe(44);

    const repeatImport = applyDeliveryBatch(firstImport.updatedRecords, initialBatch, overrides);
    expect(repeatImport.updatedRecords.length).toBe(44);
    expect(repeatImport.result.records_added).toBe(0);
    expect(repeatImport.result.records_updated).toBe(0);
    expect(repeatImport.result.records_ignored).toBe(44);
  });

  // Test 3: Reversing record order does not change the final logical record set
  it('3. Reversing record order does not change the final logical record set', () => {
    const overrides1 = new Map<string, ManualOverride>();
    const overrides2 = new Map<string, ManualOverride>();

    const normal = applyDeliveryBatch([], initialBatch, overrides1);

    const reversedBatch: DeliveryBatchEnvelope = {
      ...initialBatch,
      records: [...initialBatch.records].reverse(),
    };
    const reversed = applyDeliveryBatch([], reversedBatch, overrides2);

    expect(normal.updatedRecords.length).toBe(reversed.updatedRecords.length);

    // Verify all 44 identity keys match
    const keysNormal = new Set(normal.updatedRecords.map((r) => r.identityKey));
    const keysReversed = new Set(reversed.updatedRecords.map((r) => r.identityKey));
    expect(keysNormal.size).toBe(44);
    expect(keysReversed.size).toBe(44);
    expect(Array.from(keysNormal).sort()).toEqual(Array.from(keysReversed).sort());
  });

  // Test 4: M07 revision 2 replaces its source payload and supplies the transcript
  it('4. M07 revision 2 replaces its source payload and supplies the transcript', () => {
    const overrides = new Map<string, ManualOverride>();
    const step1 = applyDeliveryBatch([], initialBatch, overrides);
    const m07Before = step1.updatedRecords.find((r) => r.record_ref === 'M07')!;
    expect(m07Before.hasUsableText).toBe(false);
    expect(m07Before.applied_source_revision).toBe(1);

    const step2 = applyDeliveryBatch(step1.updatedRecords, updateBatch, overrides);
    expect(step2.updatedRecords.length).toBe(44); // Distinct count remains 44!
    expect(step2.result.usable_text_count_after).toBe(18); // Usable texts increases to 18!

    const m07After = step2.updatedRecords.find((r) => r.record_ref === 'M07')!;
    expect(m07After.applied_source_revision).toBe(2);
    expect(m07After.hasUsableText).toBe(true);
    expect(m07After.transcript_payload?.turns.length).toBe(27);
    expect(m07After.analysis_freshness).toBe('fresh');
    expect(m07After.analysis?.sourceRevisionAnalysed).toBe(2);
  });

  // Test 5: Reimporting revision 1 after revision 2 does not overwrite M07
  it('5. Reimporting revision 1 after revision 2 does not overwrite M07', () => {
    const overrides = new Map<string, ManualOverride>();
    const step1 = applyDeliveryBatch([], initialBatch, overrides);
    const step2 = applyDeliveryBatch(step1.updatedRecords, updateBatch, overrides);

    // Replay initial batch (Rev 1)
    const step3 = applyDeliveryBatch(step2.updatedRecords, initialBatch, overrides);
    expect(step3.updatedRecords.length).toBe(44);
    expect(step3.result.usable_text_count_after).toBe(18);

    const m07Final = step3.updatedRecords.find((r) => r.record_ref === 'M07')!;
    expect(m07Final.applied_source_revision).toBe(2); // Still Rev 2!
    expect(m07Final.hasUsableText).toBe(true); // Still has 27 turns!
    expect(m07Final.transcript_payload?.turns.length).toBe(27);
  });

  // Test 6: A manual M07 route survives revision 2, subsequent revision 1 replay, and browser refresh simulation
  it('6. Manual M07 route survives revision 2, subsequent revision 1 replay, and restart', () => {
    const overrides = new Map<string, ManualOverride>();
    const step1 = applyDeliveryBatch([], initialBatch, overrides);

    const m07Identity = getRecordIdentityKey('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a');

    // Manually override M07
    const manualRoutes: RouteCategory[] = ['Customer Follow-up', 'Sales Coaching'];
    const updatedWithOverride = setManualOverride(
      step1.updatedRecords,
      m07Identity,
      manualRoutes,
      'Escalation triage override by manager',
      overrides
    );

    const m07Overridden = updatedWithOverride.find((r) => r.record_ref === 'M07')!;
    expect(m07Overridden.active_routes).toEqual(manualRoutes);
    expect(m07Overridden.manual_override).toBeDefined();

    // Import Revision 2 (Update)
    const step2 = applyDeliveryBatch(updatedWithOverride, updateBatch, overrides);
    const m07AfterUpdate = step2.updatedRecords.find((r) => r.record_ref === 'M07')!;
    expect(m07AfterUpdate.applied_source_revision).toBe(2);
    expect(m07AfterUpdate.hasUsableText).toBe(true);
    // Manual route must be preserved!
    expect(m07AfterUpdate.active_routes).toEqual(manualRoutes);
    expect(m07AfterUpdate.manual_override).toBeDefined();

    // Re-import Revision 1
    const step3 = applyDeliveryBatch(step2.updatedRecords, initialBatch, overrides);
    const m07AfterReplay = step3.updatedRecords.find((r) => r.record_ref === 'M07')!;
    expect(m07AfterReplay.active_routes).toEqual(manualRoutes);
    expect(m07AfterReplay.applied_source_revision).toBe(2);

    // Simulate restart/refresh: JSON serialize and deserialize
    const serialized = JSON.stringify(step3.updatedRecords);
    const reloadedRecords = JSON.parse(serialized);
    const m07Reloaded = reloadedRecords.find((r: any) => r.record_ref === 'M07');
    expect(m07Reloaded.active_routes).toEqual(manualRoutes);
    expect(m07Reloaded.applied_source_revision).toBe(2);
    expect(m07Reloaded.hasUsableText).toBe(true);
  });

  // Test 7: Usable-text coverage is calculated from nonblank supplied text
  it('7. Usable-text coverage is calculated strictly from nonblank supplied text', () => {
    // Call: must have nonblank transcript string
    const callWithText = { transcript: '  Hello world  ' } as any;
    expect(checkHasUsableText('call', callWithText, null)).toBe(true);

    const callWithBlank = { transcript: '   ' } as any;
    expect(checkHasUsableText('call', callWithBlank, null)).toBe(false);

    const callWithNull = { transcript: null } as any;
    expect(checkHasUsableText('call', callWithNull, null)).toBe(false);

    // Meeting: must have nonblank turns
    const meetingWithTurns = {
      turns: [{ text: 'Yes, I see the screen.' }],
      unavailable_reason: null,
    } as any;
    expect(checkHasUsableText('meeting', {} as any, meetingWithTurns)).toBe(true);

    const meetingWithEmptyTurns = { turns: [], unavailable_reason: 'no_speech' } as any;
    expect(checkHasUsableText('meeting', {} as any, meetingWithEmptyTurns)).toBe(false);

    const meetingWithBlankTextTurns = {
      turns: [{ text: '   ' }],
      unavailable_reason: null,
    } as any;
    expect(checkHasUsableText('meeting', {} as any, meetingWithBlankTextTurns)).toBe(false);
  });

  // Test 8: Meeting evidence references use 1-based turns
  it('8. Meeting evidence references use 1-based turns', () => {
    const overrides = new Map<string, ManualOverride>();
    const step1 = applyDeliveryBatch([], initialBatch, overrides);
    const step2 = applyDeliveryBatch(step1.updatedRecords, updateBatch, overrides);

    const m07 = step2.updatedRecords.find((r) => r.record_ref === 'M07')!;
    expect(m07.analysis?.citations).toBeDefined();

    // Check that citations cite 1-based turns, such as "M07 turn 3", "M07 turn 12", etc.
    const citations = m07.analysis!.citations;
    expect(citations.length).toBeGreaterThan(0);
    citations.forEach((c) => {
      expect(c.reference).toMatch(/M07 turn \d+/);
      const turnNum = parseInt(c.reference.replace('M07 turn ', ''), 10);
      expect(turnNum).toBeGreaterThanOrEqual(1);
      expect(turnNum).toBeLessThanOrEqual(27);
    });
  });

  // Test 9: Manifest entries have valid relative paths and every active referenced output exists
  it('9. Manifest entries have valid relative paths and every active referenced output exists', async () => {
    const overrides = new Map<string, ManualOverride>();
    const step1 = applyDeliveryBatch([], initialBatch, overrides);
    const step2 = applyDeliveryBatch(step1.updatedRecords, updateBatch, overrides);

    const manifestEntries = generateManifestEntries(step2.updatedRecords);
    expect(manifestEntries.length).toBe(44);

    // Build the archive
    const archive = await buildCompleteExportArchive(step2.updatedRecords);
    expect(archive.validationResult.isValid).toBe(true);
    expect(archive.validationResult.missingPaths.length).toBe(0);
    expect(archive.validationResult.errors.length).toBe(0);
    expect(archive.validationResult.manifestPathCount).toBeGreaterThanOrEqual(44);
  });

  // Test 10: Export can be generated and opened successfully
  it('10. Export archive ZIP can be generated and contains required structural files', async () => {
    const overrides = new Map<string, ManualOverride>();
    const step1 = applyDeliveryBatch([], initialBatch, overrides);
    const step2 = applyDeliveryBatch(step1.updatedRecords, updateBatch, overrides);

    const archive = await buildCompleteExportArchive(step2.updatedRecords);
    expect(archive.zipBlob).toBeDefined();
    expect(archive.zipBlob.size).toBeGreaterThan(1000); // Has substantive content

    expect(archive.validationResult.totalFiles).toBeGreaterThanOrEqual(65); // 44 records + 18 analyses + manifests + brief + summary + findings
  });
});
