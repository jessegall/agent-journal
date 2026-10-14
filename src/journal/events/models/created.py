from dataclasses import dataclass

from journal.events.models.model_event import ModelEvent


@dataclass(frozen=True)
class Created(ModelEvent):
    """A new row was inserted."""
