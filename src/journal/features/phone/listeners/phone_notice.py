from datetime import datetime, timezone

from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.features.phone.support.phone_waits import PhoneWaits
from journal.features.phone.support.web_push import WebPush
from journal.models.phone import Phone
from journal.repositories.phones import Phones
from journal.support.actor import Actor

MISSING_STATUSES = (404, 410)


class PhoneNotice(Listener[ClockTicked]):
    """As the clock ticks, once for the whole journal, the paired phone that subscribed is pushed when something new waits for the user, once for each, as version 3 told it."""

    def __init__(self, phones: Phones, waits: PhoneWaits, notifications: WebPush) -> None:
        self.phones, self.waits, self.notifications = phones, waits, notifications

    def handle(self, event: ClockTicked) -> None:
        time = datetime.now(timezone.utc)
        for phone in [p for p in self.phones.active(time) if p.subscription]:
            obligations = self.waits.refs(phone)
            if phone.is_push_due(obligations, time):
                self.web_push(phone, obligations, time)
            elif not phone.has_updates(obligations) and obligations != phone.pushed_refs():
                self.phones.save(phone.notified(obligations), Actor.system())

    def web_push(self, phone: Phone, obligations: list[str], time: datetime) -> None:
        status = self.notifications.send(phone.subscription)
        if status in MISSING_STATUSES:
            self.phones.save(phone.unsubscribed(), Actor.system())
        elif 200 <= status < 300:
            self.phones.save(phone.notified(obligations), Actor.system())
        else:
            self.phones.save(phone.push_failed(time), Actor.system())
