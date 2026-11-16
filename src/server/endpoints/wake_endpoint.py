from engine.driver.wake_request import WakeRequest
from server.execution.hook_turn import HookTurn
from engine.driver.wake_route import WakeRoute
from engine.enums.execution_priority import ExecutionPriority
from engine.module.journal_container import synced_database_container
from server.context.server_context import ServerContext


class WakeEndpoint:
    """Answers POST /wake/line: the text of a project hook that ran in the background becomes a line for the agent
    of its session, over one short use of the hooks' database."""

    def __init__(self, context: ServerContext) -> None:
        self.context = context

    def line(self, data: object) -> bool:
        request = WakeRequest.parsed(data)
        fields = data if isinstance(data, dict) else {}
        with self.context.hook_database.used(HookTurn(ExecutionPriority.IMMEDIATE, self.context.hook_limit_seconds, request.session, "wake")) as database:
            return synced_database_container(self.context.home, database).get(WakeRoute).line(request, str(fields.get("hook", "")), str(fields.get("text", "")))
