from dataclasses import dataclass
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class ProcessRow:
    """One process of the machine's process table: its pid, its parent's pid, and when it started, to the second."""

    pid: int
    parent_pid: int
    started_at: Timestamp
