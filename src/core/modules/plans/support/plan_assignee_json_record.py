from typing import TypedDict


class PlanAssigneeJsonRecord(TypedDict):
    """The agent that works a plan, as its card draws it."""

    id: int
    name: str
    main: bool
