from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.modules.drivers.events.stop_allowed import StopAllowed


class AllowedStopListener(CommitListener[StopAllowed]):
    """A message that landed as the stop hook let the agent stop is typed to it at once."""

    name = "messages.allowed-stop"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: StopAllowed, logged: LoggedEvent) -> None:
        if logged.environment_id is not None:
            self.bus.run(RecordWaitingMessageLine(event.row.session_agent_id), Actor(logged.actor_id, ActorType.AGENT))
