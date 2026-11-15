from collections.abc import Sequence

from engine.agent_machine.contracts.step_requests import StepRequests
from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_step_request import AgentStepRequest

OPEN_REQUESTS_REASON = "the open step requests of the agents one change names, one each"


class TableStepRequests(StepRequests):
    """Opens a step request for each named agent with no open one and joins the cause to the open ones."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def requested(self, agent_ids: Sequence[int], cause: str, context: Context) -> None:
        open_requests = {request.session_agent_id: request for request in self.queries.query(AgentStepRequest).matching(Among("session_agent_id", list(agent_ids)))
                         .filter(served_at=None).every_row(OPEN_REQUESTS_REASON)}
        for agent_id in agent_ids:
            request = open_requests.get(agent_id)
            if request is None:
                self.repository.save(AgentStepRequest(session_agent_id=agent_id, causes=tuple([cause])), context)
            elif cause not in request.causes:
                self.repository.save_change(request, request.changed(causes=(*request.causes, cause)), context)
