from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent


class ReaderWriters:
    """Allows people, modules and the main agent to change readers."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, actor: Actor) -> None:
        if self.allows(actor):
            return
        raise Refusal("only the main agent writes readers, and the journal has asked it",
                      "stop, or read on; you are started again once the reader exists")

    def allows(self, actor: Actor) -> bool:
        return actor.type is not ActorType.AGENT or self.queries.query(Agent).find(actor.id).role == AgentRole.MAIN
