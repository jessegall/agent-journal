from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.plans.queries.plan_query import PlanQuery

from .note_plan import NotePlan


class NotePlanHandler(Handler[NotePlan, str]):
    command = NotePlan

    def __init__(self, plans: PlanQuery) -> None:
        self.plans = plans

    def handle(self, command: NotePlan, context: Context) -> str:
        plan = self.plans.find(command.plan_id)
        return f"Noted plan {plan.id}: {plan.title}"
