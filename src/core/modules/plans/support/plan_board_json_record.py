from typing import TypedDict

from core.modules.plans.support.plan_card_json_record import PlanCardJsonRecord


class PlanBoardJsonRecord(TypedDict):
    """The JSON form of PlanBoard.json."""

    open_total: int
    closed_total: int
    plans: list[PlanCardJsonRecord]
