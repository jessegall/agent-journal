import re
from dataclasses import dataclass, field, replace
from datetime import datetime
from typing import ClassVar, Self

from journal.events.event import Event
from journal.support.actor import Actor
from journal.models.support.dock_card import DockCard
from journal.support.unsaved_row import UnsavedRow


@dataclass(frozen=True)
class Model:
    """A row. Data only; it never touches the database. Every row says who made it and who last changed it."""

    text_fields: ClassVar[tuple[str, ...]] = ()
    timeline_visible: ClassVar[bool] = True
    shared: ClassVar[bool] = True

    id: int | None = None
    created_at: datetime | None = None
    creator: Actor | None = None
    updated_at: datetime | None = None
    updater: Actor | None = None
    events: tuple = field(default=(), compare=False, metadata={"column": False})

    @classmethod
    def table(cls) -> str:
        singular = re.sub(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower()
        if singular.endswith("y") and singular[-2] not in "aeiou":
            return singular[:-1] + "ies"
        if singular.endswith("s"):
            return singular + "es"
        return singular + "s"

    @classmethod
    def noun(cls) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", " ", cls.__name__).lower()

    @property
    def is_new(self) -> bool:
        return self.id is None

    @property
    def row_id(self) -> int:
        if self.id is None:
            raise UnsavedRow(self.table())
        return self.id

    @property
    def creation_actor(self) -> Actor:
        if self.creator is None:
            raise UnsavedRow(self.table())
        return self.creator

    @property
    def creation_time(self) -> datetime:
        if self.created_at is None:
            raise UnsavedRow(self.table())
        return self.created_at

    @property
    def update_time(self) -> datetime:
        if self.updated_at is None:
            raise UnsavedRow(self.table())
        return self.updated_at

    def heading(self) -> str:
        numbered = f"{self.noun().capitalize()} {self.id}"
        title = self.title_words()
        return f"{numbered}: {title}" if title else numbered

    def title_words(self) -> str:
        return ""

    def summary_line(self) -> str:
        return ""

    def docked(self) -> DockCard:
        return DockCard.plain()

    @staticmethod
    def opening_line(text: str) -> str:
        return next((line.strip() for line in text.splitlines() if line.strip() and not line.startswith("#")), "")

    def mentioning_text(self) -> str:
        return "\n".join(str(getattr(self, name)) for name in self.text_fields)

    def with_(self, **changes) -> Self:
        return replace(self, **changes)

    def creation_events(self) -> tuple[Event, ...]:
        return ()

    def with_event(self, event: Event) -> Self:
        return replace(self, events=(*self.events, event))

    def with_events(self, events: tuple) -> Self:
        return replace(self, events=events)

    def without_events(self) -> Self:
        return replace(self, events=())
