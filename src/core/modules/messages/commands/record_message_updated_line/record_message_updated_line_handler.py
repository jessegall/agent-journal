from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.modules.drivers.listeners.typed_line_listener import IDLE_MESSAGE_SOURCE
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.support.message_nudges import MESSAGE_UPDATED
from core.modules.agents.support.main_agent_finder import MainAgentFinder

UPDATED_SOURCE = "messages.updated"


class RecordMessageUpdatedLineHandler(Handler[RecordMessageUpdatedLine, None]):
    """Leaves the line for the main agent: typed when it sits idle, else carried by its next hook."""

    command = RecordMessageUpdatedLine

    def __init__(self, queries: Queries, nudger: Nudger, hook_calls: HookCallQuery) -> None:
        self.queries, self.nudger, self.hook_calls = queries, nudger, hook_calls

    def handle(self, command: RecordMessageUpdatedLine, context: Context) -> None:
        agents = MainAgentFinder.rows(self.queries, command.environment_id)
        if not agents:
            return
        source = IDLE_MESSAGE_SOURCE if self.hook_calls.is_idle(agents[0].id, context.timestamp) else UPDATED_SOURCE
        self.nudger.say(agents[0].id, MESSAGE_UPDATED, source, context, message=command.message_id)
