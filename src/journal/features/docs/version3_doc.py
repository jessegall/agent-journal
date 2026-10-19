import json
from pathlib import Path

from journal.models.doc import Doc

FENCE = "---"


class Version3Doc:
    """A document as version 3 kept it: a folder holding doc.md, its row as JSON between two --- lines, then its text."""

    @staticmethod
    def read(folder: Path) -> Doc | None:
        """The document the folder holds; none for a folder with no doc.md, or one version 3 had deleted."""
        file = folder / "doc.md"
        if not file.is_file():
            return None
        _, head, body = file.read_text(errors="replace").split(f"{FENCE}\n", 2)
        row = json.loads(head)
        if row.get("deleted"):
            return None
        return Doc(title=str(row.get("title", folder.name)), abstract=str(row.get("abstract", "")), body=body.strip())
