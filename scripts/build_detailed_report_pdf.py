from pathlib import Path
import re
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem, KeepTogether
)

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "Megha_Drishti_Detailed_Report.md"
OUT = ROOT / "docs" / "Megha_Drishti_Detailed_Report.pdf"

NAVY = colors.HexColor("#1F3864")
BLUE = colors.HexColor("#0070C0")
ORANGE = colors.HexColor("#F28C28")
DARK = colors.HexColor("#1F2937")
GREY = colors.HexColor("#667085")
LIGHT_BLUE = colors.HexColor("#EDF4FB")
LIGHT_ORANGE = colors.HexColor("#FFF3E8")
BORDER = colors.HexColor("#D0D5DD")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=28, leading=31, textColor=NAVY, spaceAfter=8
))
styles.add(ParagraphStyle(
    name="CoverSub", parent=styles["Heading1"], fontName="Helvetica-Bold",
    fontSize=19, leading=22, textColor=ORANGE, spaceAfter=12
))
styles.add(ParagraphStyle(
    name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold",
    fontSize=17, leading=20, textColor=NAVY, spaceBefore=3, spaceAfter=7
))
styles.add(ParagraphStyle(
    name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=10.2, leading=12, textColor=NAVY, spaceBefore=5, spaceAfter=3
))
styles.add(ParagraphStyle(
    name="H3x", parent=styles["Heading3"], fontName="Helvetica-Bold",
    fontSize=9.0, leading=10.5, textColor=ORANGE, spaceBefore=4, spaceAfter=2
))
styles.add(ParagraphStyle(
    name="BodyX", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=8.15, leading=10.25, textColor=DARK, spaceAfter=4
))
styles.add(ParagraphStyle(
    name="SmallX", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.2, leading=8.6, textColor=GREY, spaceAfter=2
))
styles.add(ParagraphStyle(
    name="RefX", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.35, leading=8.6, textColor=DARK, spaceAfter=2.5
))
styles.add(ParagraphStyle(
    name="CalloutX", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=8.0, leading=10, textColor=DARK, spaceAfter=0
))
styles.add(ParagraphStyle(
    name="CoverMeta", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=9, leading=12, textColor=DARK, spaceAfter=4
))

def markup(text: str) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<i>\1</i>", text)
    text = re.sub(r"`([^`]+)`", r'<font name="Courier">\1</font>', text)
    # Make bare URLs clickable.
    text = re.sub(r"(https?://[^\s<]+)", r'<link href="\1" color="#0070C0">\1</link>', text)
    return text

def header_footer(canvas, doc):
    page = canvas.getPageNumber()
    canvas.saveState()
    if page > 1:
        canvas.setFont("Helvetica-Bold", 7.5)
        canvas.setFillColor(NAVY)
        canvas.drawRightString(A4[0] - 16*mm, A4[1] - 10*mm, "MEGHA-DRISHTI  |  SIH 2026 · PS 26078")
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(GREY)
    canvas.drawCentredString(A4[0]/2, 9*mm, f"CodeX_2026  ·  Detailed Technical Report  ·  {page}")
    canvas.restoreState()

def callout(text: str):
    p = Paragraph(markup(text), styles["CalloutX"])
    t = Table([[p]], colWidths=[174*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIGHT_ORANGE),
        ("BOX", (0,0), (-1,-1), 0.6, colors.HexColor("#F4C78E")),
        ("LEFTPADDING", (0,0), (-1,-1), 7),
        ("RIGHTPADDING", (0,0), (-1,-1), 7),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ]))
    return t

lines = SRC.read_text(encoding="utf-8").splitlines()
story = []
bullets = []
cover = True

def flush_bullets():
    global bullets
    if not bullets:
        return
    items = [ListItem(Paragraph(markup(x), styles["BodyX"]), leftIndent=9) for x in bullets]
    story.append(ListFlowable(items, bulletType="bullet", leftIndent=15, bulletFontName="Helvetica", bulletFontSize=6.5, spaceAfter=3))
    bullets = []

for raw in lines:
    line = raw.strip()
    if not line:
        flush_bullets()
        story.append(Spacer(1, 1.4*mm))
        continue
    if line == "<!-- PAGEBREAK -->":
        flush_bullets()
        story.append(PageBreak())
        cover = False
        continue
    if line.startswith("- "):
        bullets.append(line[2:])
        continue
    flush_bullets()

    if line.startswith("# "):
        text = line[2:].strip()
        if cover and text == "MEGHA-DRISHTI":
            story.append(Spacer(1, 28*mm))
            story.append(Paragraph(markup(text), styles["CoverTitle"]))
        else:
            story.append(Paragraph(markup(text), styles["H1x"]))
    elif line.startswith("## "):
        text = line[3:].strip()
        if cover and text == "Detailed Technical Report":
            story.append(Paragraph(markup(text), styles["CoverSub"]))
        else:
            story.append(Paragraph(markup(text), styles["H2x"]))
    elif line.startswith("### "):
        story.append(Paragraph(markup(line[4:].strip()), styles["H3x"]))
    elif line.startswith("> "):
        story.append(callout(line[2:].strip()))
        story.append(Spacer(1, 2*mm))
    elif cover and line.startswith("**") and ":" in line:
        story.append(Paragraph(markup(line), styles["CoverMeta"]))
    elif re.match(r"^\d+\.", line):
        story.append(Paragraph(markup(line), styles["RefX"]))
    else:
        story.append(Paragraph(markup(line), styles["BodyX"]))

flush_bullets()

doc = SimpleDocTemplate(
    str(OUT), pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm,
    topMargin=17*mm, bottomMargin=16*mm,
    title="MEGHA-DRISHTI Detailed Report",
    author="CodeX_2026"
)
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(OUT)
