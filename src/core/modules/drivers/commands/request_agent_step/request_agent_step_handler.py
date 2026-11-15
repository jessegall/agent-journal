from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.request_agent_step.request_agent_step import RequestAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest


class RequestAgentStepHandler(Handler[RequestAgentStep, None]):
    """Joins the cause to the agent's open step request, or opens one."""

    command = RequestAgentStep

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RequestAgentStep, context: Context) -> None:
        request = self.queries.query(AgentStepRequest).filter(session_agent_id=command.agent_id, served_at=None).first()
        if request is None:
            self.repository.save(AgentStepRequest(session_agent_id=command.agent_id, causes=tuple([command.cause])), context)
            return
        if command.cause not in request.causes:
            self.repository.save_change(request, request.changed(causes=(*request.causes, command.cause)), context)
