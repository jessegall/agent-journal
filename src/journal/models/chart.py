from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Chart(Model):
    """One workflow: the journal's conduct toward the agent as a flowchart, with a title. A journal may hold several, and the engine walks them all. Saved whole, each save a revision."""

    title: str = ""
    revision: int = 0
    shipped: bool = False
    """True for a workflow the journal ships: it carries the conduct for one event and can be reset to its shipped drawing."""
    event: str = ""
    """The event a shipped workflow is for, the key of its trigger."""

    def saved_again(self) -> "Chart":
        return self.with_(revision=self.revision + 1)
