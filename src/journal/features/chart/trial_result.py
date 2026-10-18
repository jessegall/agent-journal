from typing import TypedDict


class TrialResult(TypedDict):
    """What a trial found: the path the walk took, what the journal would say, what it assumed, the workflows it ran and where it stopped."""

    trigger: str
    row: int
    state: str
    nodes: list[int]
    would: list[str]
    assumed: list[str]
    workflows: list[int]
    read: dict[str, int]
    stopped_at: int
    plugins: str
