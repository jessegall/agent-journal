"""What a handler reads of a stored row or an agent report, matched by the string `on` and marked as a fact or a request."""

from dataclasses import dataclass, replace
from typing import ClassVar

from events import Event, Fact
from resources.fields import Loaded


@dataclass(frozen=True)
class TypedEvent(Fact, Loaded):
    """A logged event as the catalogue names it: a fact the lane dispatches to the swept features registered on its class."""

    on: ClassVar[str] = ""
    marked_as: ClassVar[type[Event]] = Fact

    @classmethod
    def read(cls, event) -> "TypedEvent":
        return cls()

    @classmethod
    def name(cls) -> str:
        return cls.on

    @classmethod
    def patterns(cls, hooks: tuple[str, ...]) -> tuple[str, ...]:
        return (cls.on,)

    def wanted(self) -> bool:
        return True


@dataclass(frozen=True)
class AgentEvent(TypedEvent):
    agent: int = 0

    @classmethod
    def read(cls, event) -> "AgentEvent":
        return replace(cls.from_json(event.data), agent=event.n)
