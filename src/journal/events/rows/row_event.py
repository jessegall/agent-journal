from dataclasses import dataclass

from journal.events.event import Event


@dataclass(frozen=True, kw_only=True)
class RowEvent(Event):
    """What happened to a row, named for the moment: carried by the model that made the change, dispatched by its repository on save, and answered by every live agent of the environment."""

    environment_id: int = 0
    at: float = 0.0
