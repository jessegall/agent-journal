from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True)
class ProcessRowDeleted:
    """The log's entry of a process row that was deleted, for a commit listener: the row itself is gone by then."""

    name: ClassVar[str] = "process.delete"
