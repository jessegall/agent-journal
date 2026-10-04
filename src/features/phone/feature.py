import features.phone.controller  # noqa: F401
from features.base import Feature
from features.journal import Journal
from features.phone.details import PhoneDetails
from features.phone.routes import PhoneRoutes
from features.sharing.routes import ROUTES, TICKS
from features.sharing.services import KEEP_UP


ROUTE = "p"

def phones_live(root) -> bool:
    from engine import runtime
    from engine.record import Record
    from features.phone.controller import Phones
    from resources.base import SYSTEM
    return bool(Phones(Record(root, runtime.env(root)), actor=SYSTEM)._live())


def phones_told(shares) -> None:
    from features.phone.controller import Phones
    from resources.base import SYSTEM
    Phones(shares.record, actor=SYSTEM)._notify()


class PhoneFeature(Feature):
    details = PhoneDetails

    def register(self, journal: Journal) -> None:
        self.register_switched(ROUTES, ROUTE, PhoneRoutes())
        self.register_global(KEEP_UP, phones_live, lambda: False)
        self.register_global(TICKS, phones_told, lambda: None)
