from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.questions.models.question import Question


class AskedByTheMainAgentGuard(Guard):
    """Refuses a question asked by anyone but a main agent: nobody answers one asked by a worker, a subagent, a
    reviewer or a verifier, or by someone who is no agent."""

    name = "questions.asked-by-the-main-agent"
    event = "question.create"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        if not isinstance(change.row, Question):
            return
        if change.actor.type is not ActorType.AGENT or self.queries.query(Agent).find(change.actor.id).role is not AgentRole.MAIN:
            raise Refusal("nobody can answer a question asked from here", "put it in the worker's report instead")
