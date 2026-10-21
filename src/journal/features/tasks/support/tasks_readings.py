from dataclasses import dataclass

from journal.models.open_task import OpenTask


@dataclass(frozen=True)
class TasksReadings:
    """The tasks feature's reading for an agent: the task in hand, the parked, the blocked and the tasks whose wait is broken."""

    in_hand: int
    last_log_line: str
    parked: tuple[int, ...]
    parked_summary: str
    blocked: tuple[int, ...]
    blocked_without_wait: tuple[int, ...]
    blocked_without_wait_summary: str
    broken_waits: tuple[int, ...]
    broken_waits_summary: str
    first_parked_why: str
    next_open: OpenTask | None
    last_commands: tuple[str, ...]
    open_ids: tuple[int, ...] = ()
    open_summary: str = ""
