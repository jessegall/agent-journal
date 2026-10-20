from datetime import datetime, timezone

from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.features.phone.support.phone_waits import PhoneWaits
from journal.features.phone.support.web_push import WebPush
from journal.repositories.phones import Phones
from journal.support.actor import Actor


class TellThePhone(AgentListener[Ticked]):
    """As the clock ticks, the paired phone that subscribed is pushed when something new waits for the user, once for each, as version 3 told it."""

    def __init__(self, phones: Phones, waits: PhoneWaits, push: WebPush) -> None:
        self.phones, self.waits, self.push = phones, waits, push

    def handle(self, event: Ticked) -> None:
        for phone in [p for p in self.phones.live(datetime.now(timezone.utc)) if p.push]:
            owed = self.waits.refs(phone)
            if phone.is_owed_a_push(owed):
                self.push.send(phone.push)
            if owed != phone.pushed_refs():
                self.phones.save(phone.told(owed), Actor.system())
