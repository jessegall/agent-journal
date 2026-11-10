from core.modules.plans.models.plan import Plan


class PlanApprovalError(Exception):
    """An approval message number stored on a plan is invalid."""

    @classmethod
    def invalid_message(cls, plan: Plan) -> "PlanApprovalError":
        return cls(f"plan {plan.id} has an approval message number that is not an integer")
