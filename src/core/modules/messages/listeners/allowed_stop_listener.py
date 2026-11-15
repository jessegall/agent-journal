from engine.agent_machine.contracts.slice_answers import WAITING_SLICE, SliceAnswers
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.modules.drivers.events.stop_allowed import StopAllowed


class AllowedStopListener(CommitListener[StopAllowed]):
    """A message that landed as the stop hook let the agent stop is typed to it at once."""

    name = "messages.allowed-stop"

    def __init__(self, bus: Bus, slices: SliceAnswers) -> None:
        self.slices = slices
        self.bus = bus

    def handle(self, event: StopAllowed, logged: LoggedEvent) -> None:
        # the waiting slice wakes the agent through its message step and the one wake owner
        if logged.environment_id is not None and not self.slices.answers(event.row.session_agent_id, WAITING_SLICE):
            self.bus.run(RecordWaitingMessageLine(event.row.session_agent_id), Actor(logged.actor_id, ActorType.AGENT))
