from dataclasses import dataclass, fields

from journal.events.models.model_event import ModelEvent
from journal.models.model import Model


@dataclass(frozen=True)
class Updated(ModelEvent):
    """An existing row was written; `was` is the row as it stood before, so a listener can say what changed."""

    was: Model | None = None

    def changed(self) -> tuple[str, ...]:
        if self.was is None:
            return ()
        return tuple(f.name for f in fields(self.model) if f.name not in ("updated_at", "updated_by") and getattr(self.model, f.name) != getattr(self.was, f.name))
