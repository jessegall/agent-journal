from dataclasses import dataclass

from journal.events.model_event import ModelEvent


@dataclass(frozen=True)
class Saving(ModelEvent):
    """Before any write, new or existing."""
