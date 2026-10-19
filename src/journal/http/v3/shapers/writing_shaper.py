import re
from typing import Callable

from journal.http.v3.listed_rows import ListedRows
from journal.http.v3.listing import Listing
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, viewer_ref
from journal.models.ref import Ref

HEADING = re.compile(r"^## +(.+)$", re.MULTILINE)


class WritingShaper(Shaper):
    """What reports and docs share: a title, a line that says what it is, a body as the brief, and the body's second-level headings as sections. A list carries each without its body, marked a summary; the viewer asks for the whole one by its number."""

    def __init__(self, listed: Callable[[], list], linked: Callable[[], dict[int, list[Ref]]], type: str, data: dict) -> None:
        self.listed, self.linked, self.type, self.data = listed, linked, type, data

    def answer(self, listing: Listing) -> ListedRows:
        rows = self.rows() if listing.only else self.summaries()
        return ListedRows(**listing.listed(rows), counts=self.counted(rows))

    def rows(self) -> list[V3Row]:
        linked = self.linked()
        return [V3Row.of(self.type, r, title=r.title, abstract=r.abstract, brief=r.body, sections=self.sections(r.body), refs=self.refs(linked, r.id), data=dict(self.data)) for r in self.listed()]

    def summaries(self) -> list[V3Row]:
        linked = self.linked()
        return [V3Row.of(self.type, r, title=r.title, abstract=r.abstract, refs=self.refs(linked, r.id), data=dict(self.data), summary=True) for r in self.listed()]

    @staticmethod
    def refs(linked: dict[int, list[Ref]], n: int) -> list[str]:
        return [viewer_ref(ref) for ref in linked.get(n, [])]

    @staticmethod
    def sections(body: str) -> list[dict]:
        parts = HEADING.split(body)
        return [{"title": parts[i].strip(), "body": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]
