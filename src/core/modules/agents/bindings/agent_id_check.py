from engine.cli.agent_ids import AgentIds
from engine.container.round_state import RoundState
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent


class AgentIdCheck(AgentIds, RoundState):
    """Refuses an agent id that no agent of the line's environment has, with one text whether or not an agent
    of another environment has it, so a line learns nothing of other environments. A line that runs in no
    environment is refused. An id checked once in a round is not read again in it."""

    def __init__(self, queries: Queries, scopes: Scopes) -> None:
        self.queries, self.scopes = queries, scopes
        self.found: set[tuple[int, int]] = set()

    def reset(self) -> None:
        self.found = set()

    def checked(self, agent_id: int, environment_id: int | None) -> int:
        if environment_id is None:
            raise Refusal(f"agent {agent_id} is read in an environment, and this line runs in none", "name the environment with --environment")
        if (agent_id, environment_id) not in self.found:
            with self.scopes.opened(None, environment_id):
                if not self.queries.query(Agent).filter(id=agent_id).exists():
                    raise Refusal(f"no agent {agent_id} in this environment", "journal agent list")
            self.found.add((agent_id, environment_id))
        return agent_id
