from typing import TypedDict


class PlanPhaseTaskJsonRecord(TypedDict):
    """The JSON form of a task in OutlinePhase.json."""

    id: int
    title: str
    state: str
    priority: int
    complexity: int | None
    tags: list[str]
    reason: str
    automatic: bool
    assigned_actor_id: int | None
    is_main_assignee: bool
    helper_id: int | None
    helper_name: str | None
    helper_main: bool
