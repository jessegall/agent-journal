import re

from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row
from journal.models.environment import Environment
from journal.repositories.scoped_repository import ScopedRepository

HEADING = re.compile(r"^## +(.+)$", re.MULTILINE)


class WritingShaper(Shaper):
    """What reports and docs share: a title, a body as the brief, and the body's second-level headings as sections."""

    def __init__(self, repository: ScopedRepository, type: str, data: dict) -> None:
        self.repository, self.type, self.data = repository, type, data

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of(self.type, r, title=r.title, brief=r.body, sections=self.sections(r.body), data=dict(self.data)) for r in self.repository.in_(environment.id)]

    @staticmethod
    def sections(body: str) -> list[dict]:
        parts = HEADING.split(body)
        return [{"title": parts[i].strip(), "body": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]
