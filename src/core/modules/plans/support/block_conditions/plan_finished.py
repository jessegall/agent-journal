from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan


class PlanFinished(BlockCondition):
    """This plan is completed or cancelled."""

    name = "plan-finished"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Plan).find(int(self.text)).state in (PlanState.COMPLETED, PlanState.CANCELLED)
