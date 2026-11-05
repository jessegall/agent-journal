from typing import TypedDict

from core.modules.plans.support.plan_agent_json_record import PlanAgentJsonRecord
from core.modules.plans.support.plan_working_task_json_record import PlanWorkingTaskJsonRecord


class PlanCardJsonRecord(TypedDict):
    """The JSON form of one card of PlanBoard.json."""

    id: int
    title: str
    state: str
    task_count: int
    completed_count: int
    testing_count: int
    current_phase: int
    delegated: bool
    agents: list[PlanAgentJsonRecord]
    working: list[PlanWorkingTaskJsonRecord]
