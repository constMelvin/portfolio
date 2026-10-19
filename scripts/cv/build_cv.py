"""Generate the CV from the website data (run via `npm run cv`).

1. Reads the CV content from src/data/cv.ts (through scripts/cv/data.mjs)
2. Fills scripts/cv/template.docx, reusing its own paragraph formatting so the
   fonts, section rules and right-aligned dates stay exactly as designed
3. Writes cv/John-Melvin-Domingo-CV.docx and exports the PDF behind the
   "Download CV" button with Microsoft Word (public/John-Melvin-Domingo-CV.pdf)
"""
import json
import os
import re
import shutil
import subprocess
import tempfile
import sys
import zipfile
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATE = os.path.join(ROOT, "scripts", "cv", "template.docx")
DOCX = os.path.join(ROOT, "cv", "John-Melvin-Domingo-CV.docx")
PDF = os.path.join(ROOT, "public", "John-Melvin-Domingo-CV.pdf")
HASH = os.path.join(ROOT, "cv", ".cv-hash")


def load_data():
    out = subprocess.run(
        ["node", "--experimental-strip-types", "--no-warnings", os.path.join(ROOT, "scripts", "cv", "data.mjs")],
        capture_output=True, text=True, encoding="utf-8", check=True,
    )
    return json.loads(out.stdout)


# --- paragraph builders, cloned from the template's sample paragraphs -------------

with zipfile.ZipFile(TEMPLATE) as z:
    template_xml = z.read("word/document.xml").decode("utf-8")
SAMPLES = re.findall(r"<w:p[ >].*?</w:p>", template_xml, re.S)


def ppr(p):
    return re.search(r"<w:pPr>.*?</w:pPr>", p, re.S).group(0)


def rprs(p):
    # formatting of each run (not the paragraph-mark rPr inside pPr)
    return re.findall(r"<w:r [^>]*><w:rPr>(.*?)</w:rPr>", p, re.S)


P = {
    "name": SAMPLES[0], "contact": SAMPLES[1], "gap": SAMPLES[2], "section": SAMPLES[3],
    "sp4": SAMPLES[4], "sp6": SAMPLES[5], "entry": SAMPLES[6], "role": SAMPLES[7],
    "note": SAMPLES[8], "gap14": SAMPLES[11], "bullet": SAMPLES[20], "after": SAMPLES[23],
    "skill": SAMPLES[55],
}
R = {k: rprs(v) for k, v in P.items()}


def run(rpr, text="", tab=False):
    t = f'<w:t xml:space="preserve">{escape(text)}</w:t>' if text else ""
    return f"<w:r><w:rPr>{rpr}</w:rPr>{'<w:tab/>' if tab else ''}{t}</w:r>"


def para(kind, *runs):
    return f"<w:p>{ppr(P[kind])}{''.join(runs)}</w:p>"


def section(title):
    return [para("section", run(R["section"][0], title), run(R["section"][1], tab=True)), P["sp4"], P["sp6"]]


def entry(e, spacer):
    out = [para("entry", run(R["entry"][0], e["title"]), run(R["entry"][1], e.get("right") or "", tab=True))]
    if e.get("subtitle"):
        out.append(para("role", run(R["role"][0], e["subtitle"]), run(R["role"][1], e.get("subtitleRight") or "", tab=True)))
    out += [para("note", run(R["note"][0], n)) for n in e.get("notes") or []]
    out += [para("bullet", run(R["bullet"][0], b)) for b in e.get("bullets") or []]
    out.append(P[spacer])
    return out


def build_body(d):
    body = [
        para("name", run(R["name"][0], d["name"])),
        para("contact", run(R["contact"][0], "  |  ".join(d["contact"]))),
        P["gap"],
    ]
    for title, key, spacer in [
        ("EDUCATION", "education", "gap14"),
        ("WORK EXPERIENCE", "work", "after"),
        ("PROJECTS", "projects", "after"),
        ("ACTIVITIES", "activities", "after"),
    ]:
        if d[key]:
            body += section(title)
            for e in d[key]:
                body += entry(e, spacer)
    if d["skills"]:
        body += section("ADDITIONAL")
        body += [para("skill", run(R["skill"][0], s["label"]), run(R["skill"][1], f": {s['text']}")) for s in d["skills"]]
    return "".join(body)


def write_docx(body):
    start = template_xml.index("<w:body>") + len("<w:body>")
    end = template_xml.index("<w:sectPr")
    xml = template_xml[:start] + body + template_xml[end:]
    os.makedirs(os.path.dirname(DOCX), exist_ok=True)
    with zipfile.ZipFile(TEMPLATE) as src, zipfile.ZipFile(DOCX, "w", zipfile.ZIP_DEFLATED) as dst:
        for item in src.infolist():
            data = xml.encode("utf-8") if item.filename == "word/document.xml" else src.read(item)
            dst.writestr(item, data)


def pdf_pages(path):
    with open(path, "rb") as f:
        return len(re.findall(rb"/Type\s*/Page(?!s)", f.read()))


def export_with_word():
    """Windows + Microsoft Word. Returns the page count, or None if Word isn't available."""
    if os.name != "nt":
        return None
    ps = (
        "$w = New-Object -ComObject Word.Application; $w.Visible = $false; $w.DisplayAlerts = 0;"
        f"try {{ $d = $w.Documents.Open('{DOCX}', $false, $true); $d.ComputeStatistics(2);"
        f"$d.SaveAs2('{PDF}', 17); $d.Close($false) }} finally {{ $w.Quit() }}"
    )
    try:
        out = subprocess.run(["powershell", "-NoProfile", "-Command", ps], capture_output=True, text=True, timeout=180)
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return None
    pages = re.findall(r"^\s*(\d+)\s*$", out.stdout, re.M)
    return int(pages[0]) if out.returncode == 0 and pages else None


def export_with_libreoffice():
    """Linux / CI fallback (GitHub Actions). Returns the page count, or None if LibreOffice is missing."""
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        return None
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", tmp, DOCX],
                       check=True, capture_output=True, timeout=300)
        made = os.path.join(tmp, os.path.splitext(os.path.basename(DOCX))[0] + ".pdf")
        shutil.move(made, PDF)
    return pdf_pages(PDF)


def main():
    sys.stdout.reconfigure(encoding="utf-8")  # ✓ / ⚠ on the Windows console
    cv = load_data()

    # --if-changed: leave the existing (Word-made) PDF alone unless the CV data changed
    if "--if-changed" in sys.argv and os.path.exists(PDF) and os.path.exists(HASH):
        if open(HASH, encoding="utf-8").read().strip() == cv["hash"]:
            print("✓ CV already up to date with the website data")
            return

    write_docx(build_body(cv["data"]))
    print(f"✓ {os.path.relpath(DOCX, ROOT)}")

    engine = "Word"
    pages = export_with_word()
    if pages is None:
        engine = "LibreOffice"
        pages = export_with_libreoffice()
    if pages is None:
        print("✗ Couldn't export the PDF — needs Microsoft Word (Windows) or LibreOffice. Open the .docx and")
        print(f"  save it as PDF to {os.path.relpath(PDF, ROOT)}")
        sys.exit(1)
    print(f"✓ {os.path.relpath(PDF, ROOT)} ({pages} page{'s' if pages != 1 else ''}, via {engine})")
    if pages > 1:
        print("⚠ The CV runs past one page — trim some bullets, or set cv: false on an entry")

    with open(HASH, "w", encoding="utf-8") as f:
        f.write(cv["hash"] + "\n")


if __name__ == "__main__":
    main()
