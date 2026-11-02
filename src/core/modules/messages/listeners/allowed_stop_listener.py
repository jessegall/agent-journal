from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.commit_listener import CommitListener
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.messages.commands.tell_idle_agent.tell_idle_agent import TellIdleAgent


class AllowedStopListener(CommitListener):
    """A message that landed as the stop hook let the agent stop is typed to it at once."""

    name = "messages.allowed-stop"
    event = "hook_call.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        if event.environment_id is not None and event.data["hook"][1] == HookEventName.STOP and event.data["answer"][1] == HookAnswer.ALLOWED:
            self.bus.run(TellIdleAgent(event.environment_id), Actor(event.actor_id, ActorType.AGENT), environment_id=event.environment_id)
