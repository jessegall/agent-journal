from typing import TypedDict

from core.modules.plans.support.plan_agent_json_record import PlanAgentJsonRecord


class PlanCardJsonRecord(TypedDict):
    """The JSON form of one card of PlanBoard.json."""

    id: int
    title: str
    state: str
    task_count: int
    completed_count: int
    current_phase: int
    delegated: bool
    agents: list[PlanAgentJsonRecord]
