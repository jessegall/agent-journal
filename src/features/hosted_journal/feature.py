from pathlib import Path

from engine.stop import STAYS_UP
from features.base import Feature
from features.hosted_journal.details import HostedJournalDetails
from features.hosted_journal.gateway import Gateway
from features.journal import Journal
from features.sharing.address import ANSWERS_AT
from features.sharing.routes import EVERY_OTHER, ROUTES
from features.sharing.services import KEEP_UP, LISTENS, Listen


def always(root: Path) -> bool:
    return True


def listen(record) -> Listen:
    settings = HostedJournalDetails.values(record)
    return Listen(settings["listen"], int(settings["port"]))


def address(record) -> str:
    return HostedJournalDetails.values(record)["address"]


class HostedJournalFeature(Feature):
    details = HostedJournalDetails

    def register(self, journal: Journal) -> None:
        ROUTES.add(self, Gateway(), key=EVERY_OTHER)
        KEEP_UP.add(self, always)
        STAYS_UP.add(self, always)
        LISTENS.add(self, listen)
        ANSWERS_AT.add(self, address)
