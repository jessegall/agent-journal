from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.messages.commands.tell_idle_agent.tell_idle_agent import TellIdleAgent
from core.modules.messages.models.enums.message_type import MessageType


class IdleMessageListener(CommitListener):
    """A message the person writes while the main agent sits idle wakes it."""

    name = "messages.idle-message"
    event = "message.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        if event.environment_id is not None and event.data["type"][1] == MessageType.USER:
            self.bus.run(TellIdleAgent(event.environment_id), Actor(event.actor_id, ActorType.USER), environment_id=event.environment_id)
