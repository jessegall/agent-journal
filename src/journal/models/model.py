import re
from dataclasses import dataclass, field, replace
from datetime import datetime
from typing import ClassVar

from journal.events.event import Event
from journal.support.actor import Actor
from journal.models.support.dock_card import DockCard


@dataclass(frozen=True)
class Model:
    """A row. Data only; it never touches the database. Every row says who made it and who last changed it."""

    text_fields: ClassVar[tuple[str, ...]] = ()
    in_timeline: ClassVar[bool] = True

    id: int | None = None
    created_at: datetime | None = None
    created_by: Actor | None = None
    updated_at: datetime | None = None
    updated_by: Actor | None = None
    events: tuple = field(default=(), compare=False, metadata={"column": False})

    @classmethod
    def table(cls) -> str:
        singular = re.sub(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower()
        if singular.endswith("y") and singular[-2] not in "aeiou":
            return singular[:-1] + "ies"
        return singular + "s"

    @classmethod
    def noun(cls) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", " ", cls.__name__).lower()

    @property
    def is_new(self) -> bool:
        return self.id is None

    def heading(self) -> str:
        numbered = f"{self.noun().capitalize()} {self.id}"
        title = self.title_words()
        return f"{numbered}: {title}" if title else numbered

    def title_words(self) -> str:
        return ""

    def summary(self) -> str:
        return ""

    def docked(self) -> DockCard:
        return DockCard.plain()

    @staticmethod
    def first_line(text: str) -> str:
        return next((line.strip() for line in text.splitlines() if line.strip() and not line.startswith("#")), "")

    def mentioning_text(self) -> str:
        return "\n".join(str(getattr(self, name)) for name in self.text_fields)

    def with_(self, **changes) -> "Model":
        return replace(self, **changes)

    def with_event(self, event: Event) -> "Model":
        return replace(self, events=(*self.events, event))

    def with_events(self, events: tuple) -> "Model":
        return replace(self, events=events)

    def without_events(self) -> "Model":
        return replace(self, events=())
