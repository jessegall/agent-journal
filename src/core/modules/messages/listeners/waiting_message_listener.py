from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from engine.event.created import Created
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_targets import MessageTargets


class WaitingMessageListener(CommitListener[Created[Message]]):
    """A message the user writes while the main agent sits idle wakes it, also while the agent is paused."""

    name = "messages.idle-message"
    run_order = -2

    def __init__(self, bus: Bus, targets: MessageTargets) -> None:
        self.bus, self.targets = bus, targets

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        if logged.environment_id is None or event.row.type not in PERSON_MESSAGE_TYPES:
            return
        agent = self.targets.recipient(event.row)
        # the message step and the one wake owner wake an agent, but never a paused one; a person's message is still
        # typed to a paused one, since a pause stops its work and not the chat
        if agent is not None and agent.paused_at is not None:
            self.bus.run(RecordWaitingMessageLine(agent.id), Actor(logged.actor_id, ActorType.USER))
