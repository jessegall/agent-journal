from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.messages.commands.tell_message_updated.tell_message_updated import TellMessageUpdated
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message

TEXT_FIELD = "text"


class ReadMessageEditListener(CommitListener):
    """A person's message whose text changes after the agent read it is named to the agent."""

    name = "messages.read-message-edit"
    event = "message.*"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        if event.event == "message.create" or TEXT_FIELD not in event.data:
            return
        message = self.queries.query(Message).find(event.row_id)
        if message.type in PERSON_MESSAGE_TYPES and message.read_at is not None:
            self.bus.run(TellMessageUpdated(message.id, message.environment_id), Actor(event.actor_id, ActorType.USER), environment_id=message.environment_id)
