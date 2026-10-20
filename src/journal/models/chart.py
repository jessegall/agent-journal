from dataclasses import dataclass, field

from journal.models.model import Model

@dataclass(frozen=True)
class Chart(Model):
    """One workflow: the journal's conduct toward the agent as a flowchart, with a title. A journal may hold several, and the engine walks them all. Saved whole, each save a revision."""

    title: str = ""
    revision: int = 0
    shipped: bool = False
    """True for a workflow the journal ships: it carries the conduct of its state at its event and can be reset to its shipped drawing."""
    event: str = ""
    """The event this workflow was made for, the key of its first trigger, which a shipped drawing is known by."""
    state: str = ""
    """The state this workflow is for, by name; empty means always, whatever the agent is doing."""
    places: dict = field(default_factory=dict)
    """Its place in each event's list it holds a trigger for, lower first: the order the workflows of one event run in, which the user drags, each event its own."""
    drawing: str = ""
    """The name of the shipped drawing this workflow came from, the state and the event it was shipped for; empty on one of the user's own."""
    drawn_version: int = 0
    """The DRAWINGS_VERSION the shipped drawing was drawn at, so a newer release knows it is behind."""
    locked: bool = False
    """True for a workflow that is the journal's law: it runs first at its event and cannot be deleted or turned off."""

    @classmethod
    def noun(cls) -> str:
        return "workflow"

    def saved_again(self) -> "Chart":
        return self.with_(revision=self.revision + 1)

    def place_at(self, event: str) -> int:
        return self.places[event]

    def answers(self, event: str) -> bool:
        return event in self.places

    def placed(self, event: str, place: int) -> "Chart":
        return self.with_(places={**self.places, event: place})

    def unplaced(self, event: str) -> "Chart":
        return self.with_(places={key: place for key, place in self.places.items() if key != event})
