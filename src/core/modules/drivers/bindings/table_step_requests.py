from collections.abc import Sequence

from engine.agent_machine.contracts.step_requests import StepRequests
from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.support.agent_slices import AgentSlices

OPEN_REQUESTS_REASON = "the open step requests of the agents one change names, one each"


class TableStepRequests(StepRequests):
    """Opens a step request for each named agent that a slice of the new driver answers and that has no
    open one, and joins the cause to the open ones; an agent no slice answers gets none, since its step
    would do nothing."""

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, slices: AgentSlices) -> None:
        self.queries, self.repository, self.agents, self.slices = queries, repository, agents, slices

    def requested(self, agent_ids: Sequence[int], cause: str, context: Context) -> None:
        if not self.slices.has_active_slice():
            return
        agent_ids = [agent.id for agent in self.agents.find_many(list(agent_ids)) if self.slices.tick_slices(agent)]
        if not agent_ids:
            return
        open_requests = {request.session_agent_id: request for request in self.queries.query(AgentStepRequest).matching(Among("session_agent_id", list(agent_ids)))
                         .filter(served_at=None).every_row(OPEN_REQUESTS_REASON)}
        for agent_id in agent_ids:
            request = open_requests.get(agent_id)
            if request is None:
                self.repository.save(AgentStepRequest(session_agent_id=agent_id, causes=tuple([cause])), context)
            elif cause not in request.causes:
                self.repository.save_change(request, request.changed(causes=(*request.causes, cause)), context)
