from typing import TypedDict


class ListedWorkflow(TypedDict):
    """A workflow as the Workflows page lists it: what it is, whether it was edited, failed or fell behind its shipping, and its last walk and failure."""

    id: int
    title: str
    revision: int
    shipped: bool
    event: str
    state: str
    place: int
    places: dict
    off: bool
    edited: bool
    failed: bool
    behind: bool
    locked: bool
    guarded: bool
    warnings: list[str]
    revised_by: str
    last_walk: dict
    last_failure: dict
