from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process


class OutputAccess:
    """Whose outputs a caller reads: a worker's own only, every other caller's those of its environment."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def agent(self, caller: Caller) -> Agent | None:
        if caller.actor.type is not ActorType.AGENT:
            return None
        return self.queries.query(Agent).find(caller.actor.id)

    def environment(self, caller: Caller) -> int:
        agent = self.agent(caller)
        environment_id = agent.environment_id if agent is not None else caller.environment_id
        if environment_id is None:
            raise Refusal("outputs are read in an environment", "name one with --environment")
        return environment_id

    def is_own_only(self, caller: Caller) -> bool:
        agent = self.agent(caller)
        return agent is not None and agent.role is AgentRole.WORKER

    def process(self, caller: Caller, process_id: int) -> Process:
        process = self.queries.query(Process).find(process_id)
        if self.is_own_only(caller) and process.agent_id != caller.actor.id:
            raise Refusal(f"output {process_id} is not yours", "a worker reads the outputs of its own lines")
        return process
