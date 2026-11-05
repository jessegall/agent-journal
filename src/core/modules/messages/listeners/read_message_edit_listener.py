from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.base.change.changed import Changed

TEXT_FIELD = "text"


class ReadMessageEditListener(CommitListener[Changed[Message]]):
    """A person's message whose text changes after the agent read it is named to the agent."""

    name = "messages.read-message-edit"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Changed[Message], logged: LoggedEvent) -> None:
        if logged.event == "message.create" or TEXT_FIELD not in logged.data:
            return
        message = event.row
        if message.type in PERSON_MESSAGE_TYPES and message.read_at is not None:
            self.bus.run(RecordMessageUpdatedLine(message.id, message.environment_id), Actor(logged.actor_id, ActorType.USER), environment_id=message.environment_id)
