from dataclasses import dataclass

from journal.events.event import Event
from journal.models.model import Model


@dataclass(frozen=True)
class NumberRequest(Event):
    """A new row about to be inserted asks for its number; a listener answers one, or no answer lets SQLite number it."""

    model: Model
