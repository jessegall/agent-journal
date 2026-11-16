from dataclasses import dataclass

from engine.enums.execution_priority import ExecutionPriority


@dataclass(frozen=True)
class HookTurn:
    """What a hook asks its turn at the database with: its priority, how long it may wait, whose agent it serves and
    for which event."""

    priority: ExecutionPriority
    wait_seconds: float
    owner: str = ""
    event_name: str = "hook"
