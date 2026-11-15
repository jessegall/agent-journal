from engine.request.request_values import RequestValues
from collections.abc import Sequence

from engine.agent_machine.states.step_requests import StepRequests
from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_step_request import AgentStepRequest

OPEN_REQUESTS_REASON = "the open step requests of the agents one change names, one each"


class TableStepRequests(StepRequests):
    """Opens a step request for each named agent that has no open one, and joins the cause to the open ones."""

    def __init__(self, queries: Queries, repository: Repository, request_values: RequestValues) -> None:
        self.queries, self.repository, self.request_values = queries, repository, request_values

    def requested(self, agent_ids: Sequence[int], cause: str, context: Context) -> None:
        if not agent_ids:
            return
        open_requests = self.open_requests(list(agent_ids))
        for agent_id in agent_ids:
            request = open_requests.get(agent_id)
            if request is None:
                open_requests[agent_id] = self.repository.save(AgentStepRequest(session_agent_id=agent_id, causes=tuple([cause])), context)
            elif cause not in request.causes:
                open_requests[agent_id] = self.repository.save_change(request, request.changed(causes=(*request.causes, cause)), context)

    # the open requests of these agents, kept for the request as it opens and joins them, so each agent's is read once
    def open_requests(self, agent_ids: list[int]) -> dict[int, AgentStepRequest | None]:
        kept: dict[int, AgentStepRequest | None] = self.request_values.read("drivers.open-step-requests", lambda: 0, dict)
        unread = [agent_id for agent_id in agent_ids if agent_id not in kept]
        if unread:
            found = {request.session_agent_id: request for request in self.queries.query(AgentStepRequest).matching(Among("session_agent_id", unread))
                     .filter(served_at=None).every_row(OPEN_REQUESTS_REASON)}
            kept.update({agent_id: found.get(agent_id) for agent_id in unread})
        return kept
