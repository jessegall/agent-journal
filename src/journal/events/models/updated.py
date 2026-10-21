from dataclasses import dataclass, fields
from typing import TypeVar

from journal.events.models.model_event import ModelEvent
from journal.models.model import Model

M = TypeVar("M", bound=Model)


@dataclass(frozen=True)
class Updated(ModelEvent):
    """An existing row was written; `was` is the row as it stood before, so a listener can say what changed."""

    previous: Model | None = None

    def previous_row(self, kind: type[M]) -> M | None:
        return self.previous if isinstance(self.previous, kind) else None

    def changed(self) -> tuple[str, ...]:
        if self.previous is None:
            return ()
        return tuple(f.name for f in fields(self.model) if f.name not in ("updated_at", "updater") and getattr(self.model, f.name) != getattr(self.previous, f.name))
