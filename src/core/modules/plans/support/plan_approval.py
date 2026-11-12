from engine.row.metadata import Metadata
from core.modules.plans.models.plan import Plan
from core.modules.plans.errors.plan_approval_error import PlanApprovalError
from core.modules.plans.support.plan_settings import MODULE_KEY

MESSAGE_KEY = "approval_message_id"


class PlanApproval:
    """Stores and reads the message attached to a plan's approval."""

    @staticmethod
    def with_message(plan: Plan, message_id: int) -> Metadata:
        return Metadata({**plan.metadata.values, MODULE_KEY: {**plan.metadata.module_part(MODULE_KEY), MESSAGE_KEY: message_id}})

    @staticmethod
    def message_id(plan: Plan) -> int | None:
        value = plan.metadata.module_part(MODULE_KEY).get(MESSAGE_KEY)
        if value is None:
            return None
        if type(value) is not int:
            raise PlanApprovalError.invalid_message(plan)
        return value
