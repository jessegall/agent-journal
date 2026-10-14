from dataclasses import dataclass

from journal.events.model_event import ModelEvent


@dataclass(frozen=True)
class Saved(ModelEvent):
    """After any write, new or existing."""
