from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.line_typing import LineTyping
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.models.message import Message
from core.modules.messages.support.waiting_message_lines import WAITING_MESSAGE_SOURCE, WaitingMessageLines


class WaitingMessageTypingListener(CommitListener):
    """Types the line that tells an idle main agent of a waiting message, unless the message was read or told
    by a hook meanwhile, when the line is dropped. The message counts as delivered once the line was typed; a line
    that could not be typed waits for the next hook and for the tick that makes a new one."""

    name = "messages.waiting-message-typing"
    event = "agent_line.create"
    run_order = -1

    def __init__(self, queries: Queries, typing: LineTyping, lines: WaitingMessageLines, bus: Bus) -> None:
        self.queries, self.typing, self.lines, self.bus = queries, typing, lines, bus

    def handle(self, event: LoggedEvent) -> None:
        line = self.queries.query(AgentLine).find(event.row_id)
        if line.source != WAITING_MESSAGE_SOURCE or line.state is not AgentLineState.WAITING:
            return
        agent = self.queries.query(Agent).find(line.agent_id)
        message = self.lines.oldest_unread(agent.environment_id)
        if message is None or message.delivered_at is not None or not self.lines.names(line, message):
            self.lines.drop(line, event)
            return
        actor = Actor(event.actor_id, ActorType.USER)
        if self.typing.type_line(line, actor, event.environment_id) and self.queries.query(Message).find(message.id).delivered_at is None:
            self.bus.run(RecordMessageDelivery(message.id), actor, environment_id=event.environment_id)
