from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row
from journal.models.environment import Environment
from journal.repositories.scoped_repository import ScopedRepository


class MemoryShaper(Shaper):
    """What facts and reminders share: the text is the title."""

    def __init__(self, repository: ScopedRepository, type: str, data: dict) -> None:
        self.repository, self.type, self.data = repository, type, data

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of(self.type, r, title=r.text, data=dict(self.data)) for r in self.repository.in_(environment.id)]
