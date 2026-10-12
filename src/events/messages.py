"""The moments of the message resource type."""

from dataclasses import dataclass, replace
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class MessageCreated(ResourceEvent):
    on: ClassVar[str] = "message.created"


@dataclass(frozen=True)
class MessageCompleted(ResourceEvent):
    on: ClassVar[str] = "message.completed"


@dataclass(frozen=True)
class MessageRequested(ResourceEvent):
    on: ClassVar[str] = "message.requested"


@dataclass(frozen=True)
class MessageRevised(ResourceEvent):
    on: ClassVar[str] = "message.revised"


@dataclass(frozen=True)
class MessageCommissioned(ResourceEvent):
    on: ClassVar[str] = "message.commissioned"


@dataclass(frozen=True)
class MessageUpdated(ResourceEvent):
    on: ClassVar[str] = "message.updated"
    numbers: tuple = ()
    file: str = ""

    @classmethod
    def read(cls, event) -> "MessageUpdated":
        return replace(super().read(event), numbers=tuple(event.data.get("numbers") or [event.n]))
