from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.restore_refusal_skip.restore_refusal_skip import RestoreRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class RestoreRefusalSkipHandler(Handler[RestoreRefusalSkip, RefusalSkip]):
    """A person gives any agent its skip back; a main agent only the agents it started."""

    command = RestoreRefusalSkip

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RestoreRefusalSkip, context: Context) -> RefusalSkip:
        agent = self.queries.query(Agent).find(command.agent_id)
        if context.actor.type is ActorType.AGENT and agent.parent_id != context.actor.id:
            raise Refusal("only a person gives a main agent its skip back", "ask the person")
        skip = self.queries.query(RefusalSkip).filter(session_agent_id=agent.id).newest().first()
        if skip is None:
            raise Refusal(f"agent {agent.id} has skipped no refusal")
        return self.repository.update(skip, context, restored_at=context.timestamp)
