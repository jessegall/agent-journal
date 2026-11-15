from engine.agent_machine.needs.step_requests import StepRequests
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.request_agent_step.request_agent_step import RequestAgentStep


class RequestAgentStepHandler(Handler[RequestAgentStep, None]):
    """Joins the cause to each agent's open step request, or opens one."""

    command = RequestAgentStep

    def __init__(self, requests: StepRequests) -> None:
        self.requests = requests

    def handle(self, command: RequestAgentStep, context: Context) -> None:
        self.requests.requested(command.agent_ids, command.cause, context)
