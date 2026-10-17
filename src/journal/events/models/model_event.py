from dataclasses import dataclass

from journal.events.event import Event
from journal.models.actor import Actor
from journal.models.model import Model


@dataclass(frozen=True, kw_only=True)
class ModelEvent(Event):
    """An event about one row and who is changing it; the repository fires one at each step of a write."""

    model: Model
    by: Actor

    @property
    def key(self) -> str:
        """A row event as table.moment: tasks.created."""
        return f"{self.model.table()}.{type(self).__name__.lower()}"
