from pathlib import Path

from agents.terminal import AT_ONCE
from engine.stop import STAYS_UP
from features.base import Feature
from features.hosted_journal.details import HostedJournalDetails
from features.hosted_journal.gateway import NEVER_FROM_OUTSIDE, Gateway
from features.journal import Journal
from features.phone.desktop import CLOSED
from features.sharing.address import ANSWERS_AT
from features.sharing.origins import ORIGINS, ProxyLookup, ProxyOrigins
from features.sharing.routes import EVERY_OTHER, ROUTES
from features.sharing.services import KEEP_UP, LISTENS, Listen


def always(root: Path) -> bool:
    return True


def listen(record) -> Listen:
    settings = HostedJournalDetails.values(record)
    return Listen(settings["listen"], int(settings["port"]), kept=not settings["apart"])


def agents_at_once(record) -> int:
    return int(HostedJournalDetails.values(record)["agents"])


def address(record) -> str:
    return HostedJournalDetails.values(record)["address"]


class HostedJournalFeature(Feature):
    details = HostedJournalDetails

    def __init__(self) -> None:
        super().__init__()
        self.lookup = ProxyLookup()

    def origins(self, record) -> ProxyOrigins:
        return ProxyOrigins(HostedJournalDetails.values(record)["proxy"], self.lookup)

    def register(self, journal: Journal) -> None:
        ROUTES.add(self, Gateway(), key=EVERY_OTHER)
        KEEP_UP.add(self, always)
        STAYS_UP.add(self, always)
        LISTENS.add(self, listen)
        ANSWERS_AT.add(self, address)
        AT_ONCE.add(self, agents_at_once)
        CLOSED.add(self, NEVER_FROM_OUTSIDE)
        ORIGINS.add(self, self.origins)
