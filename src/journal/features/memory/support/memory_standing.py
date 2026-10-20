from dataclasses import dataclass


@dataclass(frozen=True)
class MemoryStanding:
    """The memory feature's reading: the context mark the agent owes a decision at."""

    mark_owed: int
