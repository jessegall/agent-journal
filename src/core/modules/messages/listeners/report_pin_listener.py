from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.pins.support.link_pin_check import LinkPinCheck


class ReportPinListener(CommitListener[Created[Message]]):
    """Pins pull request links sent in agent reports, and design links only in the report that ended a
    designer's job."""

    name = "messages.report-pins"

    def __init__(self, bus: Bus, check: LinkPinCheck, queries: Queries) -> None:
        self.bus, self.check, self.queries = bus, check, queries

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        message = event.row
        if message.type is not MessageType.AGENT or message.is_chat_visible:
            return
        has_job_report = self.queries.query(HelperJob).filter(report_message_id=message.id).exists()
        designs = self.check.design_pins(message.text) if has_job_report else []
        for pin in [*designs, *self.check.change_request_pins(message.text)]:
            self.bus.run(pin, Actor(logged.actor_id, ActorType.AGENT), environment_id=message.environment_id, cause_id=logged.id)
