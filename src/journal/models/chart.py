from dataclasses import dataclass

from journal.models.model import Model

@dataclass(frozen=True)
class Chart(Model):
    """One workflow: the journal's conduct toward the agent as a flowchart, with a title. A journal may hold several, and the engine walks them all. Saved whole, each save a revision."""

    @classmethod
    def noun(cls) -> str:
        return "workflow"

    title: str = ""
    revision: int = 0
    shipped: bool = False
    """True for a workflow the journal ships: it carries the conduct of its state at its event and can be reset to its shipped drawing."""
    event: str = ""
    """The event this workflow answers, the key of its one trigger."""
    state: str = ""
    """The state this workflow is for, by name: a state at an event has one workflow."""
    drawn_version: int = 0
    """The shipping a shipped workflow's drawing came from: one the user edited that the shipping has since moved past is told so."""

    def saved_again(self) -> "Chart":
        return self.with_(revision=self.revision + 1)
