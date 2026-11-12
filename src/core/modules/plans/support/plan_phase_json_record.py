from typing import TypedDict

from core.modules.plans.support.plan_phase_task_json_record import PlanPhaseTaskJsonRecord


class PlanPhaseJsonRecord(TypedDict):
    """The JSON form of OutlinePhase.json."""

    id: int
    title: str
    goal: str
    checkpoint: bool
    tasks: list[PlanPhaseTaskJsonRecord]
