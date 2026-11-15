from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.nudges.message_file_nudge import MessageFileNudge
from core.modules.messages.nudges.new_message_nudge import NewMessageNudge
from core.modules.messages.nudges.new_messages_nudge import NewMessagesNudge
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

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        batch = self.undelivered.batch(event, agent_id)
        if batch is None:
            return []
        heading = NewMessageNudge.declared().nudge(message=batch.messages[0].id) if batch.waiting == 1 else NewMessagesNudge.declared().nudge(count=batch.waiting)
        return [heading, *(MessageFileNudge.declared().nudge(message=message.id, name=name) for message in batch.messages for name in message.files)]
