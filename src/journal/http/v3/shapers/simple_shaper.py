from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row
from journal.models.environment import Environment
from journal.repositories.repository import Repository


class SimpleShaper(Shaper):
    """A project-wide type whose rows have a title and a brief and nothing the viewer needs beyond: sequences, triggers, checks."""

    def __init__(self, repository: Repository, type: str, title, brief, data) -> None:
        self.repository, self.type, self.title, self.brief, self.data = repository, type, title, brief, data

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of(self.type, r, title=self.title(r), brief=self.brief(r), data=self.data(r)) for r in self.repository.all()]
