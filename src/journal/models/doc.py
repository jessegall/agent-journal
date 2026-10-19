from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Doc(Model):
    """A document of the project, the same in every environment: a title, a line that says what it is, and its text."""

    title: str = ""
    abstract: str = ""
    body: str = ""

    def mentioning_text(self) -> str | None:
        return self.body
