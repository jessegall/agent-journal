from dataclasses import dataclass

from journal.events.model_event import ModelEvent


@dataclass(frozen=True)
class Deleting(ModelEvent):
    """Before a row is removed; a listener may refuse."""
