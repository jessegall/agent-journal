from dataclasses import dataclass


@dataclass(frozen=True)
class PruneWindow:
    """One step of pruning a log: the newest rows kept, the id the last step reached, and how many ids one step
    may walk past it."""

    kept: int
    after_id: int
    width: int
