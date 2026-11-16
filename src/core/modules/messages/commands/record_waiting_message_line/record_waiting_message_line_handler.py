from engine.command.context import Context
from engine.command.handler import Handler
from engine.model.model import Model
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from engine.driver.message_sender import MessageSender
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.modules.messages.agent_messages.new_message_notice import NewMessageNotice
from core.modules.messages.support.waiting_message_lines import WAITING_MESSAGE_SOURCE, WaitingMessageLines
from core.modules.agents.support.agent_rows import AgentRows

RETRY_SECONDS = 10
MOST_WAITING_LINES = 3


class RecordWaitingMessageLineHandler(Handler[RecordWaitingMessageLine, Model | None]):
    """An idle main agent, paused or not, sends no hook that could carry a message, so a line for the first of
    the queue is typed to it; the rest reach it by the hooks that follow, once it wakes. The message counts as
    delivered only once its line was typed or a hook took it, so a line that could not be typed is made anew
    every ten seconds, at most three waiting at once."""

    command = RecordWaitingMessageLine

    def __init__(self, message_sender: MessageSender, hook_calls: HookCallQuery, lines: WaitingMessageLines, agents: AgentRows) -> None:
        self.message_sender, self.hook_calls, self.lines = message_sender, hook_calls, lines
        self.agents = agents

    def handle(self, command: RecordWaitingMessageLine, context: Context) -> Model | None:
        agent = self.agents.find(command.agent_id) if command.agent_id is not None else self.agents.main_agent()
        if agent is not None and agent.ended_at is not None:
            return None
        if agent is None or not self.hook_calls.is_prompt_open(agent.id):
            return None
        message = self.lines.waking_message(agent.id)
        if message is None:
            return None
        waiting = self.lines.waiting(agent.id).take(MOST_WAITING_LINES)
        if len(waiting) == MOST_WAITING_LINES or (waiting and waiting[0].creation_timestamp().elapsed_seconds(context.timestamp) < RETRY_SECONDS):
            return None
        return self.message_sender.send(agent.id, NewMessageNotice.declared(), WAITING_MESSAGE_SOURCE, context, message=message.id)
