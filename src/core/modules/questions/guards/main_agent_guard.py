from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from core.base.guard.guard import Guard
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.questions.models.question import Question
from core.base.change.created import Created
from core.base.command.context import Context


class MainAgentGuard(Guard[Created[Question]]):
    """Allows only the main agent to ask the person a question."""

    name = "questions.asked-by-the-main-agent"

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, event: Created[Question], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or self.rows.required(Agent, context.actor.id).role != AgentRole.MAIN:
            raise Refusal("nobody can answer a question asked from here", "put it in your report to the main agent instead")
