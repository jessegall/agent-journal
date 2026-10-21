from dataclasses import dataclass

from journal.models.open_task import OpenTask


@dataclass(frozen=True)
class TasksStanding:
    """The tasks feature's reading for an agent: the task in hand, the parked, the blocked and the tasks whose wait is broken."""

    in_hand: int
    parked: tuple[int, ...]
    parked_named: str
    blocked: tuple[int, ...]
    blocked_without_wait: tuple[int, ...]
    blocked_without_wait_named: str
    broken_waits: tuple[int, ...]
    broken_waits_named: str
    first_parked_why: str
    next_open: OpenTask | None
    last_commands: tuple[str, ...]
