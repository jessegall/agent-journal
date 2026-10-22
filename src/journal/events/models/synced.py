from dataclasses import dataclass

from journal.events.models.model_event import ModelEvent


@dataclass(frozen=True)
class Synced(ModelEvent):
    """A row was written from a change the team server sent, not by this machine; listeners that write on a local change never hear it."""
