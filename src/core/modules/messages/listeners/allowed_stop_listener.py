from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.commit_listener import CommitListener
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine
from core.base.change.created import Created
from core.modules.drivers.models.hook_call import HookCall


class AllowedStopListener(CommitListener[Created[HookCall]]):
    """A message that landed as the stop hook let the agent stop is typed to it at once."""

    name = "messages.allowed-stop"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        if logged.environment_id is not None and logged.data["hook"][1] == HookEventName.STOP and logged.data["answer"][1] == HookAnswer.ALLOWED:
            self.bus.run(RecordWaitingMessageLine(logged.environment_id), Actor(logged.actor_id, ActorType.AGENT), environment_id=logged.environment_id)
