from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.pins.support.link_pin_check import LinkPinCheck


class ReportPinListener(CommitListener[Created[Message]]):
    """Pins design and pull request links sent in agent reports."""

    name = "messages.report-pins"

    def __init__(self, bus: Bus, check: LinkPinCheck) -> None:
        self.bus, self.check = bus, check

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        message = event.row
        if message.type is not MessageType.AGENT or message.is_chat_visible:
            return
        for pin in [*self.check.design_pins(message.text), *self.check.pull_request_pins(message.text)]:
            self.bus.run(pin, Actor(logged.actor_id, ActorType.AGENT), environment_id=message.environment_id, cause_id=logged.id)
