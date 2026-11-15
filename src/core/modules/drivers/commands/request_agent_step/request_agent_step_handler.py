from engine.agent_machine.contracts.step_requests import StepRequests
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.request_agent_step.request_agent_step import RequestAgentStep


class RequestAgentStepHandler(Handler[RequestAgentStep, None]):
    """Joins the cause to the agent's open step request, or opens one."""

    command = RequestAgentStep

    def __init__(self, requests: StepRequests) -> None:
        self.requests = requests

    def handle(self, command: RequestAgentStep, context: Context) -> None:
        self.requests.requested(tuple([command.agent_id]), command.cause, context)
