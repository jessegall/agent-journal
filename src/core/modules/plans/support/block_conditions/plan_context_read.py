from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_context_delivery import PlanContextDelivery


class PlanContextRead(BlockCondition):
    """The current execution episode was read, or the plan no longer executes."""

    name = "plans.context-read"
    subject_scoped = True

    def is_true(self, check: BlockCheck) -> bool:
        plan = check.container.get(Queries).query(Plan).filter(id=int(self.text)).first()
        if plan is None or plan.state is not PlanState.STARTED:
            return True
        delivery = check.container.get(PlanContextDelivery)
        event_id = delivery.start_event(plan)
        return event_id is None or delivery.has_read(plan.id, event_id, check.hook.agent_id)
