"""The event of a file an agent edited."""

from dataclasses import dataclass
from typing import ClassVar

from engine.files import EDITED
from events.typed import AgentEvent


@dataclass(frozen=True)
class FileEdited(AgentEvent):
    on: ClassVar[str] = f"file.{EDITED}"
    at: float = 0.0
    path: str = ""
    kind: str = ""
    before: str = ""
    after: str = ""
    added: int = 0
    removed: int = 0
