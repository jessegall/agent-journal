from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.drivers.commands.count_step_failure.count_step_failure import CountStepFailure
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.support.countdowns import Countdowns
from core.modules.drivers.support.step_request_failures import STEP_REQUEST_FAILURES


class CountStepFailureHandler(Handler[CountStepFailure, None]):
    """Counts one failed try of the request on its agent's countdown of step request failures."""

    command = CountStepFailure

    def __init__(self, queries: Queries, countdowns: Countdowns) -> None:
        self.queries, self.countdowns = queries, countdowns

    def handle(self, command: CountStepFailure, context: Context) -> None:
        request = self.queries.query(AgentStepRequest).find(command.request_id)
        self.countdowns.tick(STEP_REQUEST_FAILURES, request.session_agent_id, str(request.id), context)
