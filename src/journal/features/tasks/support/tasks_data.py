from dataclasses import dataclass

from journal.models.open_task import OpenTask


@dataclass(frozen=True)
class TasksData:
    """The tasks feature's reading for an agent: its own task in hand, the parked, the blocked, the tasks whose wait is broken, and the tasks it holds, started now or before."""

    current_task: int
    last_log_line: str
    suspended: tuple[int, ...]
    suspension_summary: str
    blocked: tuple[int, ...]
    blocked_without_wait: tuple[int, ...]
    blocked_without_wait_summary: str
    broken_waits: tuple[int, ...]
    broken_waits_summary: str
    first_suspension_reason: str
    next_open: OpenTask | None
    last_commands: tuple[str, ...]
    open_ids: tuple[int, ...] = ()
    open_summary: str = ""
    started_ids: tuple[int, ...] = ()
    agent_tasks: tuple[int, ...] = ()
