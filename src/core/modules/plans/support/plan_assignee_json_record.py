from typing import TypedDict


class PlanAssigneeJsonRecord(TypedDict):
    """The JSON form of PlanInspection.assignee_json."""

    id: int
    name: str
    main: bool
