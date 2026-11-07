from core.base.model.added_state import AddedState
from core.base.model.move import Move
from core.base.model.state_addition import StateAddition
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan

REVIEWING = AddedState("reviewing")
REVIEW_MOVE = Move("review", [PlanState.READY], REVIEWING)
REVIEWED_MOVE = Move("reviewed", [REVIEWING], PlanState.READY)
REVIEW_STATE = StateAddition(Plan, REVIEWING, "Under review", PlanState.READY, PlanState.READY, (REVIEW_MOVE, REVIEWED_MOVE), editable=True, tip_read="plan review-tip {row_id}")
