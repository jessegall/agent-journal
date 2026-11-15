from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.needs.line_history import LineHistory
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.agent_messages.plan_approved_message import PlanApprovedMessage
from core.modules.plans.agent_messages.plan_approval_note_message import PlanApprovalNoteMessage
from core.modules.plans.agent_messages.plan_blocked_message import PlanBlockedMessage
from core.modules.plans.agent_messages.plan_cancelled_message import PlanCancelledMessage
from core.modules.plans.agent_messages.plan_waiting_message import PlanWaitingMessage
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.support.plan_approval import PlanApproval

CHANGED_PLANS_REASON = "every plan whose state changed since the last answer is told to the agent"
STATE_AGENT_MESSAGES: dict[PlanState, MessageTemplate] = {
    PlanState.READY: PlanWaitingMessage.declared(),
    PlanState.APPROVED: PlanApprovedMessage.declared(),
    PlanState.CANCELLED: PlanCancelledMessage.declared(),
    PlanState.BLOCKED: PlanBlockedMessage.declared(),
}


class PlanStateLines(EventLineSource):
    """A plan of the environment ready, approved, cancelled or blocked since these lines last spoke is named to
    the main agent."""

    key = "plans.state-lines"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, plans: PlanQuery, history: LineHistory, queries: Queries) -> None:
        self.plans, self.history, self.queries = plans, history, queries

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        start = self.history.last_spoke(self.key, agent_id) or self.queries.query(Agent).find(agent_id).creation_timestamp()
        changed = self.plans.matching(Greater("updated_at", start.text)).matching(Among("state", tuple(STATE_AGENT_MESSAGES))).every_row(CHANGED_PLANS_REASON)
        return [self.plan_agent_message(plan) for plan in changed]

    @staticmethod
    def plan_agent_message(plan: Plan) -> AgentMessage:
        if plan.state is not PlanState.APPROVED:
            return STATE_AGENT_MESSAGES[plan.state].agent_message(plan=plan.id)
        message_id = PlanApproval.message_id(plan)
        if message_id is None:
            return PlanApprovedMessage.declared().agent_message(plan=plan.id)
        return PlanApprovalNoteMessage.declared().agent_message(plan=plan.id, message=message_id)
