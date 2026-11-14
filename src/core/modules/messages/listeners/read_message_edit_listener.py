from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from engine.event.updated import Updated

TEXT_FIELD = "text"


class ReadMessageEditListener(CommitListener[Updated[Message]]):
    """A user's message whose text changes after the agent read it is named to the agent."""

    name = "messages.read-message-edit"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Updated[Message], logged: LoggedEvent) -> None:
        if TEXT_FIELD not in logged.data:
            return
        message = event.row
        if message.type in PERSON_MESSAGE_TYPES and message.read_at is not None:
            self.bus.run(RecordMessageUpdatedLine(message.id), Actor(logged.actor_id, ActorType.USER),
                         environment_id=message.environment_id)
