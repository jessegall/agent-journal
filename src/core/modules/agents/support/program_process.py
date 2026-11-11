from dataclasses import dataclass

from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class ProgramProcess:
    """The process an agent's program runs in: its number and the moment it started, as the process table reads
    it; none of either when the launcher named no process."""

    pid: int | None
    started_at: Timestamp | None
