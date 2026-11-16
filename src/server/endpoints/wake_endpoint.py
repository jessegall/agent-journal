from engine.driver.wake_ask import WakeAsk
from engine.driver.wake_reply import WakeReply
from engine.driver.wake_route import WakeRoute
from engine.enums.execution_priority import ExecutionPriority
from engine.module.journal_container import synced_database_container
from server.context.server_context import ServerContext
from server.errors.lane_busy_error import LaneBusyError

# an ask is answered within 25 seconds, inside the wake hook's own 30 second limit for one ask
WAKE_WAIT_SECONDS = 25.0


class WakeEndpoint:
    """Answers POST /wake and /wake/received: the route registers the waiter and gives a line already waiting
    over one short use of the hooks' database, then waits for a line with no database held, so a waiting ask
    never counts as database work. A database too busy to register the waiter answers nothing yet, and the
    hook asks again."""

    def __init__(self, context: ServerContext) -> None:
        self.context = context

    def answer(self, data: object) -> WakeReply:
        ask = WakeAsk.parsed(data)
        try:
            with self.context.hook_database.used(ExecutionPriority.IMMEDIATE, self.context.hook_limit_seconds, ask.session, "wake") as database:
                route = synced_database_container(self.context.home, database).get(WakeRoute)
                first = route.answer(ask)
        except LaneBusyError:
            return WakeReply.nothing()
        return route.waited(first, WAKE_WAIT_SECONDS) if first.is_waiting else first

    def received(self, line_id: int, token: str) -> bool:
        with self.context.hook_database.used(ExecutionPriority.IMMEDIATE, self.context.hook_limit_seconds, "", "wake") as database:
            return synced_database_container(self.context.home, database).get(WakeRoute).received(line_id, token)

    def line(self, data: object) -> bool:
        ask = WakeAsk.parsed(data)
        fields = data if isinstance(data, dict) else {}
        with self.context.hook_database.used(ExecutionPriority.IMMEDIATE, self.context.hook_limit_seconds, ask.session, "wake") as database:
            return synced_database_container(self.context.home, database).get(WakeRoute).line(ask, str(fields.get("hook", "")), str(fields.get("text", "")))
