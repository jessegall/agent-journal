from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.plans.queries.plan_query import PlanQuery

from .audit_plan import AuditPlan


class AuditPlanHandler(Handler[AuditPlan, str]):
    command = AuditPlan

    def __init__(self, plans: PlanQuery) -> None:
        self.plans = plans

    def handle(self, command: AuditPlan, context: Context) -> str:
        plan = self.plans.find(command.plan_id)
        return f"Audited plan {plan.id}: {plan.title}"
