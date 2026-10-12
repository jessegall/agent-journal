"""What a handler reads of a row that was written, whatever its type; each type's own moments are in the module named for it."""

from dataclasses import dataclass, replace
from typing import ClassVar

from events.typed import TypedEvent

WRITTEN = ("created", "updated")
GONE = ("completed", "deleted")
CHANGES = ("created", "updated", *GONE)


@dataclass(frozen=True)
class RowAction(TypedEvent):
    action: str = ""

    @property
    def written(self) -> bool:
        return self.action in WRITTEN


@dataclass(frozen=True)
class ResourceEvent(RowAction):
    n: int = 0
    type: str = ""
    actor: str = ""
    section: str = ""
    by: str = ""

    @property
    def is_read_mark(self) -> bool:
        return self.by == "read"

    @classmethod
    def read(cls, event) -> "ResourceEvent":
        return replace(cls.from_json(event.data), n=event.n, action=event.action, type=event.type, actor=event.actor)


@dataclass(frozen=True)
class AnyEvent(ResourceEvent):
    on: ClassVar[str] = "*"


@dataclass(frozen=True)
class ResourceCreated(ResourceEvent):
    on: ClassVar[str] = "created"


@dataclass(frozen=True)
class FileAttached(ResourceEvent):
    on: ClassVar[str] = "updated"
    file: str = ""


@dataclass(frozen=True)
class RowChanged(AnyEvent):
    def wanted(self) -> bool:
        return self.action in CHANGES


@dataclass(frozen=True)
class RowReopened(ResourceEvent):
    on: ClassVar[str] = "reopened"
