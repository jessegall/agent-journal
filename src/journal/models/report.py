from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Report(Scoped):
    title: str = ""
    abstract: str = ""
    """A line that says what the report is."""
    body: str = ""

    def mentioning_text(self) -> str | None:
        return self.body
