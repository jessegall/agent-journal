from typing import TypedDict

from core.modules.plans.support.plan_agent_json_record import PlanAgentJsonRecord
from core.modules.plans.support.plan_phase_json_record import PlanPhaseJsonRecord


class PlanOutlineJsonRecord(TypedDict):
    """The JSON form of PlanOutline.json."""

    plan_id: int
    delegated: bool
    agents: list[PlanAgentJsonRecord]
    phases: list[PlanPhaseJsonRecord]
    checkpoint_lines: list[str]
