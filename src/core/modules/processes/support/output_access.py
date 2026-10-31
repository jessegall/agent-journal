from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process


class OutputAccess:
    """Whose outputs an actor reads: a worker's own only, every other actor's those of its environment."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def agent(self, actor: Actor) -> Agent | None:
        if actor.type is not ActorType.AGENT:
            return None
        return self.queries.query(Agent).find(actor.id)

    def environment(self, actor: Actor, fallback: int | None) -> int:
        agent = self.agent(actor)
        environment_id = agent.environment_id if agent is not None else fallback
        if environment_id is None:
            raise Refusal("outputs are read in an environment", "name one with --environment")
        return environment_id

    def is_worker(self, actor: Actor) -> bool:
        agent = self.agent(actor)
        return agent is not None and agent.role is AgentRole.WORKER

    def process(self, actor: Actor, process_id: int) -> Process:
        process = self.queries.query(Process).find(process_id)
        if self.is_worker(actor) and process.agent_id != actor.id:
            raise Refusal(f"output {process_id} is not yours", "a worker reads the outputs of its own lines")
        return process
