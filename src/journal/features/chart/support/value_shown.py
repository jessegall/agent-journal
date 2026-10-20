from typing import TypedDict


class ValueShown(TypedDict):
    """One count or time a workflow keeps in the environment, as its canvas shows it: its name, which kind it is, what it stands at (a count's number, a time's seconds since), when it was last set, and the steps that set it."""

    name: str
    kind: str
    value: int
    set_at: str
    set_by: list[int]
