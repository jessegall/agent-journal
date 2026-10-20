from dataclasses import dataclass


@dataclass(frozen=True)
class TasksStanding:
    """The tasks feature's reading for an agent: the task in hand, the parked, the blocked and the tasks whose wait is broken."""

    in_hand: int
    parked: tuple[int, ...]
    blocked: tuple[int, ...]
    broken_waits: tuple[int, ...]
    first_parked_why: str
    last_commands: tuple[str, ...]
