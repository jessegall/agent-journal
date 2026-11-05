from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.base.change.created import Created
from core.modules.messages.models.message import Message


class WaitingMessageListener(CommitListener[Created[Message]]):
    """A message the person writes while the main agent sits idle wakes it."""

    name = "messages.idle-message"
    run_order = -2

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        if logged.environment_id is not None and logged.data["type"][1] in PERSON_MESSAGE_TYPES:
            self.bus.run(RecordWaitingMessageLine(logged.environment_id), Actor(logged.actor_id, ActorType.USER), environment_id=logged.environment_id)
