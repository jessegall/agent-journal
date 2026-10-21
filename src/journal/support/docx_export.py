import shutil
import subprocess
import tempfile
from pathlib import Path

from journal.support.export_name import CONVERTER, ExportName
from journal.support.exported_file import ExportedFile
from journal.support.html_page import HtmlPage

WORD = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
PAGE = "text/html; charset=utf-8"
CONVERT_SECONDS = 20


class DocxExport:
    """A document or a report as a Word file: its HTML page converted by textutil, or the page itself where textutil is missing."""

    @classmethod
    def build(cls, title: str, abstract: str, body: str, fallback: str) -> ExportedFile:
        page, name = HtmlPage.build(title, abstract, body), ExportName.build(title, fallback)
        converter = shutil.which(CONVERTER)
        if converter is None:
            return ExportedFile(name, PAGE, page.encode())
        return ExportedFile(name, WORD, cls.converted(converter, page))

    @staticmethod
    def converted(converter: str, page: str) -> bytes:
        with tempfile.TemporaryDirectory() as folder:
            source, target = Path(folder) / "page.html", Path(folder) / "page.docx"
            source.write_text(page)
            subprocess.run([converter, "-convert", "docx", "-output", str(target), str(source)], check=True, capture_output=True, timeout=CONVERT_SECONDS)
            return target.read_bytes()
