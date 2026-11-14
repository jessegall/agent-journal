from dataclasses import dataclass


@dataclass(frozen=True)
class PriorityLimit:
    """What one priority may use in one lane: the slot units its running tickets may hold, and how long a ticket
    waits in this step before it is raised."""

    running_limit: int
    longest_wait_seconds: float
