from controllers.base import Controller
from engine.record import Record
from resources import types
from resources.base import SYSTEM
from controllers.rules import Rules

SENDERS: dict = {}


def sender(record: Record) -> str:
    key = (str(record.root), record.env)
    if key in SENDERS:
        return SENDERS[key]
    from controllers.environments import Environments
    place = Environments(record, actor=SYSTEM)._titled(record.env)
    if place is None:
        return ""
    SENDERS[key] = place.launched_from if place.helping else ""
    return SENDERS[key]


class Facts(Controller):
    resource = types.Fact

    def _standing(self, closed_since: float = 0, closed_last: int = 0):
        own = super()._standing(closed_since, closed_last)
        sent_from = sender(self.record)
        return [*own, *Facts(Record(self.record.root, sent_from), actor=SYSTEM)._standing()] if sent_from else own

    def promote(self, n: int):
        pin = self.load(n)
        rule = Rules(self.record, actor=self.actor).create(pin.title, pin.abstract, pin.brief, **pin.data)
        self.complete(n, how=f"promoted to rule {rule.n}")
        return rule
