from dataclasses import dataclass


@dataclass(frozen=True)
class Unblocker:
    """An open task the asking agent can take now and that unfinished tasks of a plan wait on, with how many of
    them wait on it, directly or through other tasks."""

    task_id: int
    unlocks: int
