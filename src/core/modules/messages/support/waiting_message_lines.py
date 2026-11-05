from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.drivers.commands.deliver_agent_line.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.models.message import Message
from core.modules.messages.support.unread_messages import UnreadMessages
from core.modules.messages.support.message_nudges import NEW_MESSAGE

WAITING_MESSAGE_SOURCE = "messages.waiting"


class WaitingMessageLines:
    """The lines that tell an idle main agent of the first message waiting for it: which message a line names,
    the lines of an agent that still wait, and the dropping of a line whose message was read or told by a
    hook."""

    def __init__(self, queries: Queries, hook_calls: HookCallQuery, bus: Bus, messages: UnreadMessages) -> None:
        self.queries, self.hook_calls, self.bus = queries, hook_calls, bus
        self.messages = messages

    def oldest_unread(self, agent_id: int) -> Message | None:
        return next(iter(self.messages.addressed(agent_id)), None)

    def waking_message(self, agent_id: int) -> Message | None:
        message = self.oldest_unread(agent_id)
        if message is None or message.delivered_at is None:
            return message
        call = self.hook_calls.newest_agent_hook(agent_id)
        if call is None or call.creation_timestamp() <= message.delivered_at:
            return None
        return next((message for message in self.messages.addressed(agent_id) if message.delivered_at is None), None)

    def waiting(self, agent_id: int):
        return self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=WAITING_MESSAGE_SOURCE, state=AgentLineState.WAITING).newest()

    def names(self, line: AgentLine, message: Message) -> bool:
        return line.text == NEW_MESSAGE.nudge(message=message.id).text

    def drop(self, line: AgentLine, event: LoggedEvent) -> None:
        call = self.hook_calls.newest_agent_hook(line.session_agent_id)
        if call is not None:
            self.bus.run(DeliverAgentLine(line.id, call.id, event.timestamp), Actor(event.actor_id, ActorType.USER), environment_id=event.environment_id)
