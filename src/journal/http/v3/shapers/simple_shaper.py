from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row
from journal.models.environment import Environment
from journal.repositories.repository import Repository


class SimpleShaper(Shaper):
    """A project-wide type whose rows have a title, a brief, data and maybe sections, each read by a small function: sequences, triggers, checks."""

    def __init__(self, repository: Repository, type: str, title, brief, data, sections=lambda r: []) -> None:
        self.repository, self.type, self.title, self.brief, self.data, self.sections = repository, type, title, brief, data, sections

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of(self.type, r, title=self.title(r), brief=self.brief(r), data=self.data(r), sections=self.sections(r)) for r in self.repository.all()]
