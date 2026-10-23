from dataclasses import dataclass


@dataclass(frozen=True)
class ReportsData:
    """The reports feature's reading: whether an update the user has not read waits, when the agent was last offered to write one, and when the first commit after that offer or the last update was made, which starts the clock for the next offer."""

    unread_update: bool
    offered_at: float
    clock_start_at: float
