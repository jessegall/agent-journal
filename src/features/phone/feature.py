import features.phone.controller  # noqa: F401
from features.base import Feature
from features.journal import Journal
from features.phone.details import PhoneDetails
from features.phone.routes import PhoneRoutes
from features.sharing.routes import ROUTES
from features.sharing.services import KEEP_UP


def phones_live(root) -> bool:
    from engine import runtime
    from engine.record import Record
    from features.phone.controller import Phones
    from resources.base import SYSTEM
    return bool(Phones(Record(root, runtime.env(root)), actor=SYSTEM)._live())


class PhoneFeature(Feature):
    details = PhoneDetails

    def register(self, journal: Journal) -> None:
        ROUTES["p"] = PhoneRoutes()
        if phones_live not in KEEP_UP:
            KEEP_UP.append(phones_live)
