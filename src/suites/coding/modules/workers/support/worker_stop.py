from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent

STOPPING_ACTOR_TYPES = (ActorType.USER, ActorType.AGENT)


class WorkerStop:
    """Whether a worker was stopped on purpose: ended by a person or by another agent, and not by itself or the
    journal, so the journal does not start it again."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def is_final(self, worker: Agent, actor_id: int) -> bool:
        return actor_id != worker.id and self.queries.query(ActorRecord).find(actor_id).type in STOPPING_ACTOR_TYPES
