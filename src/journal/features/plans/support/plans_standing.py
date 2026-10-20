from dataclasses import dataclass


@dataclass(frozen=True)
class PlansStanding:
    """The plans feature's reading: the approved plans, the started plan and the task it would start next."""

    approved: tuple[int, ...]
    started: int
    next_task: int
