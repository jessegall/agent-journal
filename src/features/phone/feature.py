from framework.base import Feature
from framework.journal import Journal
from features.phone.controller import phones_live, phones_paired
from features.phone.notifying import told
from features.phone.details import PhoneDetails
from features.phone.routes import PhoneRoutes
from engine.address import RELIED_ON
from declaring.registries import SHARE_ROUTES, SHARE_TICKS
from features.sharing.services import KEEP_UP

ROUTE = "p"


class PhoneFeature(Feature):
    details = PhoneDetails

    def register(self, journal: Journal) -> None:
        SHARE_ROUTES.add(self, PhoneRoutes(), key=ROUTE)
        KEEP_UP.add(self, phones_live)
        RELIED_ON.add(self, phones_paired)
        SHARE_TICKS.add(self, lambda shares: told(shares.record))
