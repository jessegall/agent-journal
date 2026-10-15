from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Chart(Model):
    """The journal's conduct toward the agent as a flowchart: one per journal. Its nodes are linked to it; its lines are links between nodes. Saved whole, each save a revision."""

    title: str = ""
    revision: int = 0

    def saved_again(self) -> "Chart":
        return self.with_(revision=self.revision + 1)
