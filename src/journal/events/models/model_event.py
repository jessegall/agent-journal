from dataclasses import dataclass

from journal.events.event import Event
from journal.models.model import Model


@dataclass(frozen=True)
class ModelEvent(Event):
    """An event about one row; the repository fires one at each step of a write."""

    model: Model
