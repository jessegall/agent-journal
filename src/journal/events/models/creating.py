from dataclasses import dataclass

from journal.events.models.model_event import ModelEvent


@dataclass(frozen=True)
class Creating(ModelEvent):
    """Before a new row is inserted; a listener may refuse."""
