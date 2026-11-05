from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan


class PlanApproved(BlockCondition):
    """This plan has been approved."""

    name = "plan-approved"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Plan).find(int(self.text)).state not in (PlanState.DRAFT, PlanState.READY)
