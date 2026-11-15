from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.support.agent_slices import AgentSlices


class AgentPins:
    """Pins an agent forward to the slices active for it at a checkpoint (doc 1310 section 13.2): a new work
    generation, as a session start does. An agent with no stack yet takes them at its first step."""

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, slices: AgentSlices) -> None:
        self.queries, self.repository, self.agents, self.slices = queries, repository, agents, slices

    def repinned(self, agent_id: int, context: Context) -> None:
        row = self.queries.query(AgentStack).filter(session_agent_id=agent_id).first()
        if row is None:
            return
        active = tuple(sorted(self.slices.active(self.agents.find(agent_id))))
        if tuple(row.pinned_slices) != active:
            self.repository.save(row.changed(pinned_slices=active), context)
