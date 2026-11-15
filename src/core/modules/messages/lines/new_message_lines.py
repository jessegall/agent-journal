from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.agent_messages.message_file_notice import MessageFileNotice
from core.modules.messages.agent_messages.new_message_notice import NewMessageNotice
from core.modules.messages.agent_messages.new_messages_notice import NewMessagesNotice
from core.modules.messages.support.undelivered_messages import UndeliveredMessages

MESSAGE_DELIVERY_KEY = "messages.delivery"
DELIVERY_EVENTS = list(HookEventName)


class NewMessageLines(EventLineSource):
    """Names each user's message waiting for its target agent, at most five a hook, with the files it carries; at the
    agent's step the line waits for the wake that types it."""

    key = MESSAGE_DELIVERY_KEY
    events = DELIVERY_EVENTS

    def __init__(self, undelivered: UndeliveredMessages) -> None:
        self.undelivered = undelivered

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        batch = self.undelivered.batch(event, agent_id)
        if batch is None:
            return []
        heading = NewMessageNotice.declared().agent_message(message=batch.messages[0].id) if batch.waiting == 1 else NewMessagesNotice.declared().agent_message(count=batch.waiting)
        return [heading, *(MessageFileNotice.declared().agent_message(message=message.id, name=name) for message in batch.messages for name in message.files)]
