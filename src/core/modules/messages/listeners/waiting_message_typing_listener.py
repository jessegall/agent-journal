from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.line_typing import LineTyping
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.models.message import Message
from core.modules.messages.support.waiting_message_lines import WAITING_MESSAGE_SOURCE, WaitingMessageLines
from core.base.change.created import Created


class WaitingMessageTypingListener(CommitListener[Created[AgentLine]]):
    """Types the line that tells an idle main agent of a waiting message, unless the message was read or told
    by a hook meanwhile, when the line is dropped. The message counts as delivered once the line was typed; a
    line that could not be typed waits for the next hook and for the tick that makes a new one."""

    name = "messages.waiting-message-typing"
    run_order = -1

    def __init__(self, rows: EventRows, typing: LineTyping, lines: WaitingMessageLines, bus: Bus) -> None:
        self.rows, self.typing, self.lines, self.bus = rows, typing, lines, bus

    def handle(self, event: Created[AgentLine], logged: LoggedEvent) -> None:
        line = event.row
        if line.source != WAITING_MESSAGE_SOURCE or line.state is not AgentLineState.WAITING:
            return
        agent = self.rows.required(Agent, line.session_agent_id)
        message = self.lines.waking_message(agent.id)
        if message is None or not self.lines.names(line, message):
            self.lines.drop(line, logged)
            return
        actor = Actor(logged.actor_id, ActorType.USER)
        if self.typing.enter_line(line, actor) and self.rows.required(Message, message.id).delivered_at is None:
            self.bus.run(RecordMessageDelivery(message.id), actor)
