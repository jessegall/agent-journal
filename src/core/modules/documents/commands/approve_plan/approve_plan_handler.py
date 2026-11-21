from engine.enums.agent_role import AgentRole
from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from core.modules.plans.support.plan_settings import MAIN_AGENT_APPROVAL_SETTING
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.documents.commands.comment_text.comment_text import CommentText
from core.modules.plans.commands.approve_plan.approve_plan import ApprovePlan
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_approval import PlanApproval


class ApprovePlanHandler(Handler[ApprovePlan, Plan]):
    """Approves a plan for a user and saves their comment in the same transaction. An agent is refused, since a user
    approves on the docked card of the plan, unless the user let the main agent approve plans: then the main agent
    approves with its reason, kept as its comment on the plan."""

    command = ApprovePlan

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, settings: SettingValues) -> None:
        self.queries, self.repository, self.bus, self.settings = queries, repository, bus, settings

    def handle(self, command: ApprovePlan, context: Context) -> Plan:
        if not context.actor.is_person():
            self.check_agent_approval(command, context)
        plan = self.queries.query(Plan).find(command.row_id)
        if plan.environment_id != context.environment_id:
            raise Refusal(f"plan {plan.id} belongs to another environment", "approve it there")
        message_text = command.message.strip()
        metadata = plan.metadata
        if message_text:
            message = self.bus.dispatch(CommentText(Plan, plan.id, message_text), context)
            metadata = PlanApproval.with_message(plan, message.id)
        return self.repository.save_change(plan, plan.moved(command.move, metadata=metadata), context)

    def check_agent_approval(self, command: ApprovePlan, context: Context) -> None:
        is_main_agent = context.actor.is_agent() and self.queries.query(Agent).find(context.actor.id).role == AgentRole.MAIN
        if not (is_main_agent and self.settings.flag(MAIN_AGENT_APPROVAL_SETTING)):
            raise Refusal(f"a plan is approved by a user on its docked plan card: plan {command.row_id} waits there", "ask the user in a message, and go on with other work")
        if not command.message.strip():
            raise Refusal("the main agent approves a plan with its reason", f'journal plan approve {command.row_id} --message "<why the plan is right>"')
