"""What the engine measured about its own work."""

from dataclasses import dataclass
from typing import ClassVar

from engine.timing import EVENT
from events.typed import TypedEvent


@dataclass(frozen=True)
class Measured(TypedEvent):
    on: ClassVar[str] = EVENT
    root: str = ""
    env: str = ""
    kind: str = ""
    target: str = ""
    took: float = 0.0
    working: float = 0.0
    after: float = 0.0
    request: int = 0
    within: int = 0
    garbage: float = 0.0
    waiting: float = 0.0
    whole_reads: tuple[str, ...] = ()
    profile: object = None
    stacks: str = ""

    @classmethod
    def read(cls, event) -> "Measured":
        return cls.from_json(event.data)
