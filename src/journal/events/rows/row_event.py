from dataclasses import dataclass, field, replace

from journal.events.event import Event
from journal.events.standing import Standing


@dataclass(frozen=True, kw_only=True)
class RowEvent(Event):
    """What happened to a row, named for the moment: carried by the model that made the change, dispatched by its repository on save, and answered by every live agent of the environment."""

    environment_id: int = 0
    at: float = 0.0
    standing: Standing = field(default_factory=lambda: Standing({}), compare=False)

    def with_standing(self, standing: Standing) -> "RowEvent":
        return replace(self, standing=standing)
