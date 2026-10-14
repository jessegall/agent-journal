from dataclasses import dataclass

from journal.events.models.model_event import ModelEvent


@dataclass(frozen=True)
class Updated(ModelEvent):
    """An existing row was written."""
