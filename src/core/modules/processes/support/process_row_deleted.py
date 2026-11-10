from dataclasses import dataclass
from typing import ClassVar

from engine.event.system_event import SystemEvent


@dataclass(frozen=True)
class ProcessRowDeleted(SystemEvent):
    """The log's entry of a process row that was deleted, for a commit listener: the row itself is gone by then."""

    name: ClassVar[str] = "process.delete"
