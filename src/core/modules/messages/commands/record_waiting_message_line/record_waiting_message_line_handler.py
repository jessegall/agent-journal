from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.modules.messages.support.message_nudges import NEW_MESSAGE
from core.modules.messages.support.waiting_message_lines import WAITING_MESSAGE_SOURCE, WaitingMessageLines
from core.modules.agents.support.main_agent_finder import MainAgentFinder

RETRY_SECONDS = 10
MOST_WAITING_LINES = 3


class RecordWaitingMessageLineHandler(Handler[RecordWaitingMessageLine, AgentLine | None]):
    """An idle main agent, paused or not, sends no hook that could carry a message, so a line for the first of
    the queue is typed to it; the rest reach it by the hooks that follow, once it wakes. The message counts as
    delivered only once its line was typed or a hook took it, so a line that could not be typed is made anew
    every ten seconds, at most three waiting at once."""

    command = RecordWaitingMessageLine

    def __init__(self, queries: Queries, nudger: Nudger, hook_calls: HookCallQuery, lines: WaitingMessageLines) -> None:
        self.queries, self.nudger, self.hook_calls, self.lines = queries, nudger, hook_calls, lines

    def handle(self, command: RecordWaitingMessageLine, context: Context) -> AgentLine | None:
        agent = MainAgentFinder.newest(self.queries, command.environment_id)
        if agent is None or not self.hook_calls.is_idle(agent.id, context.timestamp):
            return None
        message = self.lines.oldest_unread(command.environment_id)
        if message is None or message.delivered_at is not None:
            return None
        waiting = self.lines.waiting(agent.id).limited(MOST_WAITING_LINES)
        if len(waiting) == MOST_WAITING_LINES or (waiting and waiting[0].creation_timestamp().elapsed_seconds(context.timestamp) < RETRY_SECONDS):
            return None
        return self.nudger.send(agent.id, NEW_MESSAGE, WAITING_MESSAGE_SOURCE, context, message=message.id)
