from features.base import Feature
from features.journal import Journal
from features.phone.controller import phones_live, phones_told
from features.phone.details import PhoneDetails
from features.phone.routes import PhoneRoutes
from features.sharing.routes import ROUTES, TICKS
from features.sharing.services import KEEP_UP

ROUTE = "p"


class PhoneFeature(Feature):
    details = PhoneDetails

    def register(self, journal: Journal) -> None:
        self.register_switched(ROUTES, ROUTE, PhoneRoutes())
        self.register_global(KEEP_UP, phones_live, lambda: False)
        self.register_global(TICKS, phones_told, lambda: None)
