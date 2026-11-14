from typing import TypedDict


class PlanAgentJsonRecord(TypedDict):
    """The JSON form of PlanAgent.json."""

    id: int
    name: str
    main: bool
    task_id: int
    task_title: str
