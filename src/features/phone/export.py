import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

from features.sharing.page import exported

WORD = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
PAGE = "text/html; charset=utf-8"
CONVERT_SECONDS = 20
UNSAFE = re.compile(r"[^\w .,()-]+")


@dataclass(frozen=True)
class Export:
    name: str
    kind: str
    body: bytes


def export(row) -> Export:
    page, stem = exported(row), UNSAFE.sub("", row.title).strip()[:80] or f"{row.type} {row.n}"
    converter = shutil.which("textutil")
    if converter is None:
        return Export(f"{stem}.html", PAGE, page.encode())
    with tempfile.TemporaryDirectory() as folder:
        source, target = Path(folder) / "page.html", Path(folder) / "page.docx"
        source.write_text(page)
        subprocess.run([converter, "-convert", "docx", "-output", str(target), str(source)], check=True, capture_output=True, timeout=CONVERT_SECONDS)
        return Export(f"{stem}.docx", WORD, target.read_bytes())
