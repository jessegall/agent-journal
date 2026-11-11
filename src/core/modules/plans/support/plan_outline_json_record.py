from collections.abc import Mapping
from typing import TypedDict

from core.modules.plans.support.plan_agent_json_record import PlanAgentJsonRecord


class PlanOutlineJsonRecord(TypedDict):
    """The JSON form of PlanOutline.json."""

    plan_id: int
    delegated: bool
    agents: list[PlanAgentJsonRecord]
    phases: list[Mapping[str, object]]
    checkpoint_lines: list[str]
