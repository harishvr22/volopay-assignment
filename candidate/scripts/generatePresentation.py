import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

output_dir = os.path.join(os.path.dirname(__file__), '..', 'presentation')
os.makedirs(output_dir, exist_ok=True)
pptx_path = os.path.join(output_dir, 'Revenue_Intelligence_Inbox_Presentation.pptx')
pdf_path = os.path.join(output_dir, 'Revenue_Intelligence_Inbox_Presentation.pdf')

print("Generating PPTX presentation...")
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

DARK_BG = RGBColor(15, 23, 42)     # #0f172a
CARD_BG = RGBColor(30, 41, 59)     # #1e293b
ACCENT_BLUE = RGBColor(56, 189, 248) # #38bdf8 (sky-400)
TEXT_WHITE = RGBColor(248, 250, 252)
TEXT_MUTED = RGBColor(148, 163, 184)
ACCENT_GREEN = RGBColor(52, 211, 153) # #34d399
ACCENT_AMBER = RGBColor(251, 191, 36) # #fbbf24

def set_slide_background(slide):
    bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg_shape.fill.solid()
    bg_shape.fill.fore_color.rgb = DARK_BG
    bg_shape.line.fill.background()
    return bg_shape

def add_header(slide, slide_num, title, subtitle):
    # Header container
    txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.2))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    p0.text = f"SLIDE {slide_num} / 5 • SPENDNEST REVENUE INTELLIGENCE WORKSPACE"
    p0.font.size = Pt(10)
    p0.font.bold = True
    p0.font.color.rgb = ACCENT_BLUE
    
    p1 = tf.add_paragraph()
    p1.text = title
    p1.font.size = Pt(22)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    p1.space_before = Pt(4)
    
    p2 = tf.add_paragraph()
    p2.text = subtitle
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(2)

# ==========================================
# SLIDE 1: Manager Problem & 3 Main Findings
# ==========================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1)
add_header(s1, 1, "The Manager Problem & 3 Evidence-Backed Findings", 
           "Solving information fragmentation, unverified upstream labels, and late-arriving transcripts.")

# Problem box
p_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(1.2))
p_box.fill.solid()
p_box.fill.fore_color.rgb = CARD_BG
p_box.line.color.rgb = ACCENT_BLUE
ptf = p_box.text_frame
ptf.word_wrap = True
pp0 = ptf.paragraphs[0]
pp0.text = "CORE MANAGER CHALLENGE"
pp0.font.size = Pt(11)
pp0.font.bold = True
pp0.font.color.rgb = ACCENT_BLUE

pp1 = ptf.add_paragraph()
pp1.text = "Sales managers receive incoming calls, calendar meetings, and automated tags across disconnected systems. Existing summaries are withheld or incomplete, metadata conflicts with actual spoken words, transcripts arrive out of order, and generic CRMs force every conversation into an artificial sales pipeline."
pp1.font.size = Pt(11)
pp1.font.color.rgb = TEXT_WHITE
pp1.space_before = Pt(3)

# 3 Findings Columns
findings_data = [
    ("Finding 1: Post-Sale Defect Escalation (M07)", 
     "Observation: Customer A demonstrated 4 critical billing & reimbursement bugs (event description edit failing to persist, Recreate payment upload failure, stuck processing reimbursements, cached INR 18,200 amount).\n"
     "Source: Meeting M07, Turns 3, 12, 23, 25.\n"
     "Product Decision: Implemented multi-route model pairing Customer Follow-up with Sales Coaching/Engineering Escalation. Designed late-transcript update preserving manual overrides.",
     ACCENT_GREEN),
    ("Finding 2: Telephony Rep vs Spoken Caller Mismatch (C06)",
     "Observation: Call metadata assigned rep_name as 'Meera', but caller verbally stated 'Ravi here. I\'ll say at the start that this is a cold call.'\n"
     "Source: Call C06, Short exact quote.\n"
     "Product Decision: Surfaced both stored metadata and verbal transcript proof side-by-side; added Sales Coaching route to audit telephony account sharing and caller ID profiles.",
     ACCENT_AMBER),
    ("Finding 3: Regulatory Compliance Boundary (M01)",
     "Observation: Harborpath Advisory assumed SpendNest opens remote personal accounts for overseas individuals; Team member A established strict boundary that SpendNest only serves registered US business entities.\n"
     "Source: Meeting M01, Turns 2, 4.\n"
     "Product Decision: Separated Partner Coordination from direct customer sales; mandated compliance boundary verification in the inspection view.",
     ACCENT_BLUE)
]

for idx, (f_title, f_text, f_color) in enumerate(findings_data):
    left = Inches(0.8 + idx * 4.0)
    box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(3.2), Inches(3.7), Inches(3.8))
    box.fill.solid()
    box.fill.fore_color.rgb = CARD_BG
    box.line.color.rgb = f_color
    btf = box.text_frame
    btf.word_wrap = True
    
    bp0 = btf.paragraphs[0]
    bp0.text = f_title
    bp0.font.size = Pt(12)
    bp0.font.bold = True
    bp0.font.color.rgb = f_color
    
    bp1 = btf.add_paragraph()
    bp1.text = f_text
    bp1.font.size = Pt(10)
    bp1.font.color.rgb = TEXT_WHITE
    bp1.space_before = Pt(4)

# ==========================================
# SLIDE 2: Interface Decisions & What Was Left Out
# ==========================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, 2, "Interface Decisions & Deliberate Omissions", 
           "Prioritizing information clarity, traceability, and verifiable operational signals over vanity charts.")

col_left = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.2))
col_left.fill.solid()
col_left.fill.fore_color.rgb = CARD_BG
col_left.line.color.rgb = ACCENT_BLUE
ltf = col_left.text_frame
ltf.word_wrap = True

lp0 = ltf.paragraphs[0]
lp0.text = "CORE INTERFACE ARCHITECTURE DECISIONS"
lp0.font.size = Pt(14)
lp0.font.bold = True
lp0.font.color.rgb = ACCENT_BLUE

decisions = [
    ("Traceable Evidence Display:", "Every analysis directly links to 1-based turn numbers for meetings (e.g. M07 turn 12) or exact verbatim quotes for calls, keeping proof immediately findable."),
    ("Strict Operational Denominators:", "The Dashboard clearly defines its base metrics: 44 total records, 40.91% usable text coverage (18/44), and 33.33% source-reported call connection rate (10/30)."),
    ("Role Attribution Safeguards:", "Telephony reps (Arun, Leela, Kiran, Meera, Dev) are explicitly distinguished from calendar meeting organizers (team06-team14). Organizers are invite creators, not verified salespeople."),
    ("Clickable Navigation Flow:", "Clicking any dashboard card, route bar, or person row instantly filters the 44-record inbox to that exact slice for immediate inspection.")
]

for title, desc in decisions:
    p = ltf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

# Right Box: Deliberate Omissions
col_right = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.2))
col_right.fill.solid()
col_right.fill.fore_color.rgb = CARD_BG
col_right.line.color.rgb = ACCENT_AMBER
rtf = col_right.text_frame
rtf.word_wrap = True

rp0 = rtf.paragraphs[0]
rp0.text = "WHAT WE DELIBERATELY LEFT OUT & WHY"
rp0.font.size = Pt(14)
rp0.font.bold = True
rp0.font.color.rgb = ACCENT_AMBER

omissions = [
    ("Deliberately Rejected Decision (Pipeline Currency):", 
     "We explicitly rejected fabricating CRM deal values, opportunity stages, or weighted revenue totals from spoken conversational numbers (e.g. Asterloom's card counts or Willowfield's INR 18,200 defect figure)."),
    ("Why Rejected:", 
     "DATA_DICTIONARY strictly prohibits inventing pipeline numbers: 'Monetary amounts within conversation text keep their stated units; no comparable opportunity-value table is supplied.' Conversational numbers reflect software bugs or exploratory queries, not confirmed bookings."),
    ("Accepted Trade-Off:", 
     "The workspace provides zero speculative revenue forecasting or pipeline charts, delivering instead 100% verifiable operational intelligence and actionable next steps."),
    ("Omission of Fabricated Attendees:", 
     "We did not fabricate attendee identities, job titles, or participant directories where the source extract omitted them.")
]

for title, desc in omissions:
    p = rtf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

# ==========================================
# SLIDE 3: Routing/Folder Design & Difficult Case
# ==========================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, 3, "Routing/Folder Design & A Difficult Case (M07)", 
           "Transparent multi-route taxonomy, conflict-free export hierarchy, and handling late-arriving transcripts.")

# Left Column: Taxonomy & Export Structure
c3_left = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.2))
c3_left.fill.solid()
c3_left.fill.fore_color.rgb = CARD_BG
c3_left.line.color.rgb = ACCENT_GREEN
c3_ltf = c3_left.text_frame
c3_ltf.word_wrap = True

c3_lp0 = c3_ltf.paragraphs[0]
c3_lp0.text = "MULTI-ROUTE TAXONOMY & ARCHIVE DESIGN"
c3_lp0.font.size = Pt(14)
c3_lp0.font.bold = True
c3_lp0.font.color.rgb = ACCENT_GREEN

tax_items = [
    ("6 Core Destination Routes:", "Customer Follow-up, Deal / Commercial Next Step, Sales Coaching, Partner / Vendor Coordination, Nurture / No Immediate Action, and Manual Review."),
    ("Multi-Route Flexibility:", "Conversations can legitimately require multiple destinations (e.g. C03 has Customer Follow-up & Deal Next Step; C06 has Sales Coaching & Nurture)."),
    ("Automated vs Manual Separation:", "System automated suggestions remain visible alongside explicit manager manual overrides with audit rationales and reset controls."),
    ("Organised Export Architecture:", "Generates real downloadable ZIP: /manifest.json, /manifest.csv, /routing_summary.csv, /findings.json, /brief/manager_brief_2026-08-21.md, /records/ (44 files), and /analysis/ (18 files). Every manifest path is programmatically verified.")
]

for title, desc in tax_items:
    p = c3_ltf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

# Right Column: Difficult Case (M07)
c3_right = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.2))
c3_right.fill.solid()
c3_right.fill.fore_color.rgb = CARD_BG
c3_right.line.color.rgb = ACCENT_BLUE
c3_rtf = c3_right.text_frame
c3_rtf.word_wrap = True

c3_rp0 = c3_rtf.paragraphs[0]
c3_rp0.text = "DIFFICULT CASE STUDY: RECORD M07"
c3_rp0.font.size = Pt(14)
c3_rp0.font.bold = True
c3_rp0.font.color.rgb = ACCENT_BLUE

m07_case = [
    ("The Initial Delivery Condition (Rev 1):", "M07 arrived in 01_initial.json with recording_status 'recorded' and has_transcript true, but turns was empty ([]) with unavailable_reason 'no_speech'. System correctly assigned Manual Review without fabricating analysis."),
    ("Manual Manager Route Assignment:", "Manager inspected M07 and manually set destination to Customer Follow-up + Sales Coaching with rationale."),
    ("Late-Transcript Update (Rev 2):", "Delivery 02_update.json supplied Revision 2 with a 27-turn transcript demonstrating 4 production software defects."),
    ("Data Contract Compliance:", "M07 entire payload was replaced by Rev 2; analysis updated to Fresh (Rev 2); the manager's manual route remained active throughout! Subsequent re-import of Rev 1 was correctly ignored.")
]

for title, desc in m07_case:
    p = c3_rtf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

# ==========================================
# SLIDE 4: Validation of Key Number & Conclusion
# ==========================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, 4, "Validation of a Key Number & Analytical Conclusion", 
           "Step-by-step verification against raw source records, envelope payloads, and transcript turns.")

c4_left = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.2))
c4_left.fill.solid()
c4_left.fill.fore_color.rgb = CARD_BG
c4_left.line.color.rgb = ACCENT_BLUE
c4_ltf = c4_left.text_frame
c4_ltf.word_wrap = True

c4_lp0 = c4_ltf.paragraphs[0]
c4_lp0.text = "VALIDATION OF A KEY NUMBER: USABLE TEXT COVERAGE"
c4_lp0.font.size = Pt(13)
c4_lp0.font.bold = True
c4_lp0.font.color.rgb = ACCENT_BLUE

num_verif = [
    ("The Headline Number:", "Usable supplied text coverage is exactly 18 / 44 (40.91%) post-update (17 / 44 = 38.64% initially)."),
    ("Source Verification Check:", "We inspected all 44 records in 01_initial.json. 30 calls: exactly 10 calls (C01-C10) have non-null, non-blank payload.transcript. 20 calls (B01-B20) have transcript=null."),
    ("Meeting Turns Audit:", "14 meetings: exactly 7 meetings (M01-M04, M06, M09, M10) initially contain non-blank speaker turns. 7 meetings (M05, M07, M08, M11-M14) have turns=[]. Total initial usable = 10 + 7 = 17."),
    ("Post-Update Verification:", "In 02_update.json, M07 revision 2 supplies 27 turns. Total usable becomes 10 + 8 = 18. Distinct records remains strictly 44 (not 45). Verified via automated unit tests.")
]

for title, desc in num_verif:
    p = c4_ltf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

c4_right = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.2))
c4_right.fill.solid()
c4_right.fill.fore_color.rgb = CARD_BG
c4_right.line.color.rgb = ACCENT_AMBER
c4_rtf = c4_right.text_frame
c4_rtf.word_wrap = True

c4_rp0 = c4_rtf.paragraphs[0]
c4_rp0.text = "VALIDATION OF AN ANALYTICAL CONCLUSION: C06 CALLER MISMATCH"
c4_rp0.font.size = Pt(13)
c4_rp0.font.bold = True
c4_rp0.font.color.rgb = ACCENT_AMBER

concl_verif = [
    ("The Conclusion:", "Call C06 represents a high-priority Sales Coaching item for telephony credential and account audit due to identity mismatch."),
    ("Source Evidence Verification:", "In data/01_initial.json record C06, payload fields record: rep_name: 'Meera', rep_email: 'meera@example.com'."),
    ("Transcript Discrepancy:", "Verbatim transcript begins: 'Hello? Good evening, Mr Nikhil. Good evening. Ravi here. I\'ll say at the start that this is a cold call.'"),
    ("Why This Matters:", "If a manager blindly trusted telephony tags, coaching would be attributed to Meera. Grounded inspection caught the identity conflict, proving that previous system tags cannot be treated as ground truth.")
]

for title, desc in concl_verif:
    p = c4_rtf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

# ==========================================
# SLIDE 5: Trade-Offs, AI Usage, Limitations & Next Steps
# ==========================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, 5, "Trade-Offs, AI Usage, Limitations & Next Steps", 
           "Transparent engineering assessment, time allocation, and production roadmap.")

c5_left = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.2))
c5_left.fill.solid()
c5_left.fill.fore_color.rgb = CARD_BG
c5_left.line.color.rgb = ACCENT_BLUE
c5_ltf = c5_left.text_frame
c5_ltf.word_wrap = True

c5_lp0 = c5_ltf.paragraphs[0]
c5_lp0.text = "AI USAGE & DETERMINISTIC ARCHITECTURE"
c5_lp0.font.size = Pt(14)
c5_lp0.font.bold = True
c5_lp0.font.color.rgb = ACCENT_BLUE

ai_items = [
    ("Transparent AI Disclosure:", "Analyses for the 18 usable conversations and the Manager Brief were carefully pre-generated and verified against source transcripts. The application computes deduplication, revisions, filters, and routing deterministically at runtime."),
    ("Zero Fabrication Guarantee:", "No live LLM API was invoked at runtime to avoid hallucinating facts or violating local boundaries. No external API keys required."),
    ("Data Contract Compliance:", "Identity is strictly (source_type, source_id); revision upserts replace whole payloads; manual overrides are persisted in browser localStorage across browser refresh."),
    ("Time Spent:", "Approximately 7.5 hours invested across data contract engineering, UI implementation, automated testing, and presentation artifacts.")
]

for title, desc in ai_items:
    p = c5_ltf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

c5_right = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.2))
c5_right.fill.solid()
c5_right.fill.fore_color.rgb = CARD_BG
c5_right.line.color.rgb = ACCENT_GREEN
c5_rtf = c5_right.text_frame
c5_rtf.word_wrap = True

c5_rp0 = c5_rtf.paragraphs[0]
c5_rp0.text = "KNOWN LIMITATIONS & FUTURE IMPROVEMENTS"
c5_rp0.font.size = Pt(14)
c5_rp0.font.bold = True
c5_rp0.font.color.rgb = ACCENT_GREEN

lim_items = [
    ("Single-Day Activity Window:", "The dataset captures a curated slice on 21 August 2026 (Asia/Kolkata). It does not represent longitudinal rep quotas or whole-team annual trends."),
    ("No Direct Upstream Telephony Sync:", "Telephony updates currently require batch JSON ingestion rather than a live CTI webhook."),
    ("Future Improvement 1 (Live CRM Integration):", "Connect bi-directional sync to Salesforce/HubSpot to write back verified action items directly into account task queues."),
    ("Future Improvement 2 (Private LLM Sidecar):", "Embed a local, on-premise model (e.g. Ollama/Llama 3) for real-time draft analysis on new incoming audio transcripts without cloud data leakage.")
]

for title, desc in lim_items:
    p = c5_rtf.add_paragraph()
    p.text = f"• {title} {desc}"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_WHITE
    p.space_before = Pt(8)

prs.save(pptx_path)
print(f"Saved PPTX presentation to: {pptx_path}")

# ==========================================
# REPORTLAB PDF GENERATION
# ==========================================
print("Generating PDF presentation...")
doc = SimpleDocTemplate(pdf_path, pagesize=landscape(letter),
                        leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)

styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'SlideTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#0f172a'),
    spaceAfter=4
)
subtitle_style = ParagraphStyle(
    'SlideSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#475569'),
    spaceAfter=12
)
section_head = ParagraphStyle(
    'SectionHead',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=16,
    textColor=colors.HexColor('#0369a1'),
    spaceBefore=4,
    spaceAfter=4
)
body_style = ParagraphStyle(
    'SlideBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#1e293b')
)
bullet_style = ParagraphStyle(
    'SlideBullet',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor('#1e293b'),
    leftIndent=12,
    firstLineIndent=-8,
    spaceAfter=4
)

story = []

slides_content = [
    ("SLIDE 1: The Manager Problem & 3 Evidence-Backed Findings",
     "Solving information fragmentation, unverified upstream labels, and late-arriving transcripts.",
     [
         ("The Manager Challenge", 
          "Sales managers receive incoming calls, meetings, and transcripts across disparate systems with unverified labels, missing summaries, and late-arriving recordings. Generic CRMs force every conversation into an artificial pipeline."),
         ("Finding 1: Post-Sale Defect Escalation (M07)",
          "Observation: Customer A demonstrated 4 critical billing & reimbursement bugs (event description edit failing to persist, Recreate payment upload failure, stuck processing reimbursements, cached INR 18,200 amount).<br/>"
          "Source Reference: Meeting M07, Turns 3, 12, 23, 25.<br/>"
          "Product Decision: Implemented multi-route model pairing Customer Follow-up with Sales Coaching/Engineering Escalation; late-transcript update mechanism preserving manual overrides."),
         ("Finding 2: Telephony Rep vs Spoken Caller Mismatch (C06)",
          "Observation: Call metadata assigned rep_name as 'Meera', but caller verbally stated 'Ravi here. I\'ll say at the start that this is a cold call.'<br/>"
          "Source Reference: Call C06, Short exact quote.<br/>"
          "Product Decision: Displayed both stored metadata and verbal transcript proof side-by-side; added Sales Coaching route to audit telephony account sharing and caller ID profiles."),
         ("Finding 3: Regulatory Compliance Boundary (M01)",
          "Observation: Harborpath Advisory assumed SpendNest opens remote personal accounts for overseas individuals; Team member A established strict boundary that SpendNest only serves registered US business entities.<br/>"
          "Source Reference: Meeting M01, Turns 2, 4.<br/>"
          "Product Decision: Separated Partner Coordination from direct customer sales; mandated compliance boundary verification in the inspection view.")
     ]),
    ("SLIDE 2: Interface Decisions & Deliberate Omissions",
     "Prioritizing information clarity, traceability, and verifiable operational signals over vanity charts.",
     [
         ("Core Interface Decisions",
          "• Traceable Evidence Display: Every analysis directly cites 1-based turn numbers (meetings) or exact quotes (calls).<br/>"
          "• Strict Mathematical Denominators: Dashboard defines exact bases: 44 total records, 40.91% usable text coverage (18/44), and 33.33% source-reported connection rate (10/30).<br/>"
          "• Role Attribution Safeguards: Telephony reps are explicitly distinguished from calendar meeting organizers.<br/>"
          "• Clickable Navigation: Clicking any metric card instantly filters the 44-record inbox."),
         ("What Was Deliberately Left Out & Accepted Trade-Off",
          "• Rejected Alternative: Automatically inferring CRM pipeline currency values and deal stages from spoken conversational numbers.<br/>"
          "• Why Rejected: DATA_DICTIONARY strictly prohibits inventing pipeline numbers without authoritative deal tables. Spoken figures represent bugs or exploratory budgets, not confirmed bookings.<br/>"
          "• Trade-Off Accepted: Zero speculative revenue forecasting or pipeline charts; 100% verifiable operational intelligence.")
     ]),
    ("SLIDE 3: Routing/Folder Design & A Difficult Case (M07)",
     "Transparent multi-route taxonomy, conflict-free export hierarchy, and handling late-arriving transcripts.",
     [
         ("Multi-Route Taxonomy & Archive Design",
          "• 6 Standard Categories: Customer Follow-up, Deal / Commercial Next Step, Sales Coaching, Partner / Vendor Coordination, Nurture / No Immediate Action, and Manual Review.<br/>"
          "• Multi-Route Flexibility: Conversations can legitimately require multiple destinations (e.g. C03 Customer Follow-up & Deal Next Step; C06 Sales Coaching & Nurture).<br/>"
          "• Automated vs Manual Separation: Automated suggestions remain distinct from explicit manager manual overrides.<br/>"
          "• Organised Export Archive: Generates real downloadable ZIP with /manifest.json, /manifest.csv, /routing_summary.csv, /findings.json, /brief/, /records/ (44 files), and /analysis/ (18 files)."),
         ("Difficult Case Study: Record M07",
          "• Initial Delivery (Rev 1): Arrived with recording_status 'recorded' but turns was empty ([]). System correctly assigned Manual Review without fabricating analysis.<br/>"
          "• Manual Route Override: Manager inspected M07 and manually set route to Customer Follow-up + Sales Coaching.<br/>"
          "• Late-Transcript Update (Rev 2): Delivery 02_update.json supplied Revision 2 with a 27-turn transcript demonstrating 4 production software defects.<br/>"
          "• Data Contract Compliance: Whole payload replaced by Rev 2; analysis updated to Fresh; manual route preserved throughout! Subsequent re-import of Rev 1 correctly ignored.")
     ]),
    ("SLIDE 4: Validation of a Key Number & Analytical Conclusion",
     "Step-by-step verification against raw source records, envelope payloads, and transcript turns.",
     [
         ("Validation of Key Number: Usable Text Coverage",
          "• The Number: Usable text coverage is exactly 18 / 44 (40.91%) post-update (17 / 44 = 38.64% initially).<br/>"
          "• Calls Audit: 30 calls in 01_initial.json. Exactly 10 calls (C01-C10) have non-null, non-blank transcript. 20 calls (B01-B20) have transcript=null.<br/>"
          "• Meetings Audit: 14 meetings. Exactly 7 meetings (M01-M04, M06, M09, M10) initially contain non-blank speaker turns. 7 meetings (M05, M07, M08, M11-M14) have turns=[]. Initial usable = 10 + 7 = 17.<br/>"
          "• Post-Update Verification: In 02_update.json, M07 Rev 2 supplies 27 turns. Total usable becomes 10 + 8 = 18. Distinct records remains strictly 44. Verified by automated tests."),
         ("Validation of Analytical Conclusion: C06 Telephony Discrepancy",
          "• The Conclusion: Call C06 represents a high-priority Sales Coaching item for telephony credential audit.<br/>"
          "• Source Metadata: In 01_initial.json C06, payload fields record: rep_name: 'Meera', rep_email: 'meera@example.com'.<br/>"
          "• Transcript Evidence: Verbatim text begins: 'Good evening. Ravi here. I\'ll say at the start that this is a cold call.'<br/>"
          "• Operational Impact: Grounded inspection caught the identity conflict, proving that previous system tags cannot be treated as ground truth.")
     ]),
    ("SLIDE 5: Trade-Offs, AI Usage, Limitations & Next Steps",
     "Transparent engineering assessment, time allocation, and production roadmap.",
     [
         ("AI Usage & Deterministic Architecture",
          "• AI Disclosure: Analyses for the 18 usable conversations and the Manager Brief were carefully pre-generated and verified against source transcripts. Deduplication, revisions, filters, and routing execute deterministically at runtime.<br/>"
          "• Zero Runtime Hallucination: No live LLM API was invoked at runtime to avoid hallucinating facts or violating local boundaries. No external API keys required.<br/>"
          "• Data Contract Compliance: Identity is strictly (source_type, source_id); revision upserts replace whole payloads; manual overrides are persisted in browser localStorage across refresh.<br/>"
          "• Time Allocation: Approximately 7.5 hours invested across data contract engineering, UI implementation, automated testing, and presentation artifacts."),
         ("Known Limitations & Future Improvements",
          "• Single-Day Window: The dataset captures a curated slice on 21 August 2026 (Asia/Kolkata). It does not represent longitudinal rep quotas.<br/>"
          "• No Direct Upstream CTI Sync: Telephony updates currently require batch JSON ingestion rather than a live CTI webhook.<br/>"
          "• Future Step 1 (Live CRM Integration): Connect bi-directional sync to Salesforce/HubSpot to write back verified action items.<br/>"
          "• Future Step 2 (Private LLM Sidecar): Embed a local model (e.g. Ollama/Llama 3) for real-time draft analysis on new incoming audio transcripts without cloud data leakage.")
     ])
]

for idx, (title, subtitle, sections) in enumerate(slides_content):
    story.append(Paragraph(f"<b>SPENDNEST REVENUE INTELLIGENCE WORKSPACE</b>", ParagraphStyle('TopTag', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#0284c7'))))
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(Spacer(1, 4))
    
    table_data = []
    for s_title, s_text in sections:
        p_title = Paragraph(f"<b>{s_title}</b>", section_head)
        p_text = Paragraph(s_text, body_style)
        table_data.append([p_title])
        table_data.append([p_text])
        table_data.append([Spacer(1, 4)])
        
    t = Table(table_data, colWidths=['100%'])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    
    if idx < len(slides_content) - 1:
        story.append(PageBreak())

doc.build(story)
print(f"Saved PDF presentation to: {pdf_path}")
print("Presentation generation completed successfully!")
