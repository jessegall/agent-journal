import re
from typing import Callable

from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, viewer_ref
from journal.repositories.links import Links

HEADING = re.compile(r"^## +(.+)$", re.MULTILINE)


class WritingShaper(Shaper):
    """What reports and docs share: a title, a line that says what it is, a body as the brief, and the body's second-level headings as sections."""

    def __init__(self, listed: Callable[[], list], links: Links, type: str, data: dict) -> None:
        self.listed, self.links, self.type, self.data = listed, links, type, data

    def rows(self) -> list[V3Row]:
        return [V3Row.of(self.type, r, title=r.title, abstract=r.abstract, brief=r.body, sections=self.sections(r.body), refs=[viewer_ref(ref) for ref in self.links.every_target(r)], data=dict(self.data))
                for r in self.listed()]

    @staticmethod
    def sections(body: str) -> list[dict]:
        parts = HEADING.split(body)
        return [{"title": parts[i].strip(), "body": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]
