from dataclasses import dataclass

from journal.models.doc import Doc
from journal.models.model import Model
from journal.support.outline import Outline

FIRST_NOTE = "written"
TOP = "reworded the top"


@dataclass(frozen=True)
class DocRevision(Model):
    """One revision of a document, linked to it: its number from 1, the title, line and text it stood at, what changed in it section by section, and when edits stop folding into it rather than open the next."""

    number: int = 0
    title: str = ""
    abstract: str = ""
    body: str = ""
    change: str = ""
    closes_at: float = 0.0

    @classmethod
    def build(cls, doc: Doc, number: int, change: str, closes_at: float) -> "DocRevision":
        return cls(number=number, title=doc.title, abstract=doc.abstract, body=doc.body, change=change, closes_at=closes_at)

    def is_open(self, time: float) -> bool:
        return time < self.closes_at

    def folded(self, doc: Doc, change: str, closes_at: float) -> "DocRevision":
        notes = "; ".join(dict.fromkeys(part for part in [*self.change.split("; "), *change.split("; ")] if part))
        return self.with_(title=doc.title, abstract=doc.abstract, body=doc.body, change=notes, closes_at=closes_at)

    def closed(self) -> "DocRevision":
        return self.with_(closes_at=0.0)

    def difference(self, doc: Doc) -> str:
        old, new = self.parts(self.body), self.parts(doc.body)
        top = self.title != doc.title or self.abstract != doc.abstract or old.pop("", "") != new.pop("", "")
        parts = [f"added {h}" for h in new if h not in old] + [f"rewrote {h}" for h in new if h in old and old[h] != new[h]] + [f"cut {h}" for h in old if h not in new]
        return "; ".join(([TOP] if top else []) + parts)

    @staticmethod
    def parts(body: str) -> dict[str, str]:
        return {("" if section.number == 0 else section.heading): "\n".join(section.lines).strip() for section in Outline.build(body).sections}
