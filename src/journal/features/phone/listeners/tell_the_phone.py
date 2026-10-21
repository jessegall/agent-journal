from datetime import datetime, timezone

from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.features.phone.support.phone_waits import PhoneWaits
from journal.features.phone.support.web_push import WebPush
from journal.models.phone import Phone
from journal.repositories.phones import Phones
from journal.support.actor import Actor

GONE = (404, 410)


class TellThePhone(Listener[ClockTicked]):
    """As the clock ticks, once for the whole journal, the paired phone that subscribed is pushed when something new waits for the user, once for each, as version 3 told it."""

    def __init__(self, phones: Phones, waits: PhoneWaits, push: WebPush) -> None:
        self.phones, self.waits, self.push = phones, waits, push

    def handle(self, event: ClockTicked) -> None:
        now = datetime.now(timezone.utc)
        for phone in [p for p in self.phones.live(now) if p.push]:
            owed = self.waits.refs(phone)
            if phone.is_owed_a_push(owed, now):
                self.pushed(phone, owed, now)
            elif not phone.has_news(owed) and owed != phone.pushed_refs():
                self.phones.save(phone.told(owed), Actor.system())

    def pushed(self, phone: Phone, owed: list[str], now: datetime) -> None:
        status = self.push.send(phone.push)
        if status in GONE:
            self.phones.save(phone.unsubscribed(), Actor.system())
        elif 200 <= status < 300:
            self.phones.save(phone.told(owed), Actor.system())
        else:
            self.phones.save(phone.push_failed(now), Actor.system())
