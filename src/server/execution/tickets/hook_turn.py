from collections.abc import Callable
from dataclasses import dataclass, field

from engine.enums.execution_priority import ExecutionPriority


@dataclass(frozen=True)
class HookTurn:
    """What a hook asks its turn at the database with: its priority, how long it may wait, whose agent it serves,
    for which event, and whether its client still waits for the answer; a turn the server asks for itself has no
    client that can leave."""

    priority: ExecutionPriority
    wait_seconds: float
    owner: str = ""
    event_name: str = "hook"
    is_client_waiting: Callable[[], bool] = field(default=lambda: True, compare=False)
