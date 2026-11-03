from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES


class WaitingMessageListener(CommitListener):
    """A message the person writes while the main agent sits idle wakes it."""

    name = "messages.idle-message"
    event = "message.create"
    run_order = -2

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        if event.environment_id is not None and event.data["type"][1] in PERSON_MESSAGE_TYPES:
            self.bus.run(RecordWaitingMessageLine(event.environment_id), Actor(event.actor_id, ActorType.USER), environment_id=event.environment_id)
