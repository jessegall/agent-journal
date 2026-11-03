from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.aliases.models.alias import Alias


class AliasWorkers:
    """Which aliases a worker may run: only those marked for workers."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, alias: Alias, caller: Caller) -> None:
        if refusal := self.refusal(alias, caller):
            raise refusal

    def refusal(self, alias: Alias, caller: Caller) -> Refusal | None:
        if alias.worker_access or caller.actor.type is not ActorType.AGENT:
            return None
        if self.queries.query(Agent).find(caller.actor.id).role == AgentRole.WORKER.value:
            return Refusal(f"a worker runs only the aliases marked for workers, and {alias.name} is not", f"ask the main agent to mark it: journal alias edit {alias.name} --workers")
        return None
