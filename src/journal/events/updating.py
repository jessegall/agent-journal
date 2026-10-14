from dataclasses import dataclass

from journal.events.model_event import ModelEvent


@dataclass(frozen=True)
class Updating(ModelEvent):
    """Before an existing row is written; a listener may refuse."""
