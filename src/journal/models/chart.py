from dataclasses import dataclass

from journal.models.model import Model

BASE = "base"
"""The state name of the base workflow, the one that holds what every state shares."""


@dataclass(frozen=True)
class Chart(Model):
    """One workflow: the journal's conduct toward the agent as a flowchart, with a title. A journal may hold several, and the engine walks them all. Saved whole, each save a revision."""

    title: str = ""
    revision: int = 0
    shipped: bool = False
    """True for a workflow the journal ships: it carries the conduct for one event and can be reset to its shipped drawing."""
    event: str = ""
    """The event a shipped workflow is for, the key of its trigger."""
    state: str = ""
    """The state this workflow is for: base for what every state shares, a state's name for that state's own conduct; empty for a workflow of the older shape, bound to one event, which answers by its event until it retires."""

    @property
    def bound_to_a_state(self) -> bool:
        return bool(self.state)

    def saved_again(self) -> "Chart":
        return self.with_(revision=self.revision + 1)
