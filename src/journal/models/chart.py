from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Chart(Model):
    """One workflow: the journal's conduct toward the agent as a flowchart, with a title. A journal may hold several, and the engine walks them all. Saved whole, each save a revision."""

    title: str = ""
    revision: int = 0

    def saved_again(self) -> "Chart":
        return self.with_(revision=self.revision + 1)
