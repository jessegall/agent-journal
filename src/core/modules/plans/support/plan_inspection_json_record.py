from typing import TypedDict

from core.modules.plans.support.plan_agent_json_record import PlanAgentJsonRecord
from core.modules.plans.support.plan_assignee_json_record import PlanAssigneeJsonRecord
from core.modules.plans.support.plan_phase_json_record import PlanPhaseJsonRecord


class PlanInspectionJsonRecord(TypedDict):
    """The JSON form of PlanInspection.json."""

    id: int
    title: str
    brief: str
    state: str
    reason: str
    total: int
    finished: int
    current_phase: int
    document_id: int | None
    assignee: PlanAssigneeJsonRecord | None
    blocker_ids: list[int]
    delegated: bool
    agents: list[PlanAgentJsonRecord]
    phases: list[PlanPhaseJsonRecord]
    checkpoint_lines: list[str]
    complexity: float | None
