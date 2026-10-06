from features.base import Feature
from features.journal import Journal
from features.phone.controller import phones_live, phones_paired, phones_told
from features.phone.details import PhoneDetails
from features.phone.routes import PhoneRoutes
from features.sharing.address import RELIED_ON
from features.sharing.routes import ROUTES, TICKS
from features.sharing.services import KEEP_UP

ROUTE = "p"


class PhoneFeature(Feature):
    details = PhoneDetails

    def register(self, journal: Journal) -> None:
        ROUTES.add(self, PhoneRoutes(), key=ROUTE)
        KEEP_UP.add(self, phones_live)
        RELIED_ON.add(self, phones_paired)
        TICKS.add(self, phones_told)
