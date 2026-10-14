from dataclasses import dataclass

from journal.events.model_event import ModelEvent


@dataclass(frozen=True)
class Deleted(ModelEvent):
    """A row was removed."""
