from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.documents.commands.comment_text.comment_text import CommentText
from core.modules.plans.commands.approve_plan.approve_plan import ApprovePlan
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_approval import PlanApproval


class ApprovePlanHandler(Handler[ApprovePlan, Plan]):
    """Approves a plan for a person and saves their comment in the same transaction; an agent is refused, since only a person
    approves, on the docked card of the plan, and no approval is made of the attempt."""

    command = ApprovePlan

    def __init__(self, queries: Queries, repository: Repository, bus: Bus) -> None:
        self.queries, self.repository, self.bus = queries, repository, bus

    def handle(self, command: ApprovePlan, context: Context) -> Plan:
        if context.actor.type is not ActorType.USER:
            raise Refusal(f"a plan is approved by a person on its docked plan card: plan {command.row_id} waits there", "ask the person in a message, and go on with other work")
        plan = self.queries.query(Plan).find(command.row_id)
        if plan.environment_id != context.environment_id:
            raise Refusal(f"plan {plan.id} belongs to another environment", "approve it there")
        message_text = command.message.strip()
        metadata = plan.metadata
        if message_text:
            message = self.bus.dispatch(CommentText(Plan, plan.id, message_text), context)
            metadata = PlanApproval.with_message(plan, message.id)
        return self.repository.save_change(plan, plan.moved(self.command.move, metadata=metadata), context)
