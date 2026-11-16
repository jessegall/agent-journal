from dataclasses import dataclass


@dataclass(frozen=True)
class KeepPlan:
    """Which agents the renumber keeps: the main agents, folded into one, every agent that stays, mains
    included, and every agent that goes."""

    mains: frozenset[int]
    stays: frozenset[int]
    goes: frozenset[int]
