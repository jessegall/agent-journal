from core.base.metadata import Metadata
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_approval import MODULE_KEY

ASSIGNEE_KEY = "assignee_id"


class PlanAssignee:
    """Stores and reads the agent a plan is assigned to."""

    @staticmethod
    def with_agent(plan: Plan, agent_id: int) -> Metadata:
        return Metadata({**plan.metadata.values, MODULE_KEY: {**plan.metadata.module_part(MODULE_KEY), ASSIGNEE_KEY: agent_id}})

    @staticmethod
    def agent_id(plan: Plan) -> int | None:
        value = plan.metadata.module_part(MODULE_KEY).get(ASSIGNEE_KEY)
        return value if isinstance(value, int) else None
