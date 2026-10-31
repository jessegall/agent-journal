from core.actors.actor_record import ActorRecord
from core.agents.agent import Agent
from core.agents.agent_start import AgentStart
from core.base.actor import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository


class AgentStartHandler(Handler[AgentStart, Agent]):
    """Makes the actor of a new session, then its agent row with the actor's id, in one transaction."""

    command = AgentStart

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: AgentStart, context: Context) -> Agent:
        if context.environment_id is None:
            raise Refusal("an agent starts in an environment", "name one with --environment")
        if self.queries.query(Agent).filter(session=command.session).exists():
            raise Refusal(f"session {command.session} has started already", "journal agent list shows the agents")
        actor = self.repository.save(ActorRecord(type=ActorType.AGENT, name=command.session, creator_id=context.actor.id), context)
        agent = Agent(id=actor.id, environment_id=context.environment_id, parent_id=command.parent_id, creator_id=context.actor.id,
                      session=command.session, program=command.program, role=command.role)
        return self.repository.save(agent, context)
