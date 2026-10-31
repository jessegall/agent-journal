from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.phone.commands.subscribe_phone import SubscribePhone
from core.modules.phone.models.enums.phone_state import PhoneState
from core.modules.phone.models.phone import Phone
from core.modules.phone.support.push_service import PushService

UNKNOWN_STATUSES = (404, 410)


class PhoneNoticeListener(CommitListener):
    """What the notice listeners share: when something new waits for the person, every paired phone that
    subscribed is pushed once, and one the push service no longer knows loses its subscription."""

    def __init__(self, bus: Bus, queries: Queries, service: PushService) -> None:
        self.bus, self.queries, self.service = bus, queries, service

    def handle(self, event: LoggedEvent) -> None:
        for phone in self.queries.query(Phone).filter(state=PhoneState.PAIRED).all_rows():
            endpoint = phone.endpoint
            if endpoint is not None and self.service.send(endpoint) in UNKNOWN_STATUSES:
                self.bus.run(SubscribePhone(phone.token_digest, None), Actor.core(), cause_id=event.id, environment_id=event.environment_id)
