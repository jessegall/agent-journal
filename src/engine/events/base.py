from dataclasses import dataclass, replace
from typing import ClassVar

from resources.fields import Loaded


@dataclass(frozen=True)
class TypedEvent(Loaded):
    on: ClassVar[str] = ""

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
