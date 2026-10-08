import os
from pathlib import Path

from agents.terminal import AT_ONCE
from engine.stop import STAYS_UP
from features.base import Feature
from features.hosted_journal.details import HostedJournalDetails
from features.hosted_journal.gateway import NEVER_FROM_OUTSIDE, PHONE_OWNER_ACTIONS, Gateway
from features.hosted_journal.phones import VaultGuard
from features.hosted_journal.settings import FromRecord, FromVault
from features.hosted_journal.vault import Vault
from features.journal import Journal
from features.phone.desktop import CLOSED
from features.phone.guard import PHONE_GUARDS
from features.sharing.address import ANSWERS_AT
from features.sharing.origins import ORIGINS, ProxyLookup, ProxyOrigins
from features.sharing.routes import EVERY_OTHER, ROUTES
from features.sharing.services import KEEP_UP, LISTENS, Listen

APART = "AGENT_JOURNAL_APART"


def always(root: Path) -> bool:
    return True


def listen(record) -> Listen:
    settings = HostedJournalDetails.values(record)
    return Listen(settings["listen"], int(settings["port"]), kept=not settings["apart"])


def agents_at_once(record) -> int:
    return int(HostedJournalDetails.values(record)["agents"])


def phone_vault(record) -> VaultGuard:
    return VaultGuard(Vault(record.root))


class HostedJournalFeature(Feature):
    details = HostedJournalDetails

    def __init__(self) -> None:
        super().__init__()
        self.lookup = ProxyLookup()
        self.apart = os.environ.get(APART) == "1"
        self.gateway_settings = FromVault() if self.apart else FromRecord()

    def origins(self, record) -> ProxyOrigins:
        return ProxyOrigins(self.gateway_settings.of(record).proxy, self.lookup)

    def address(self, record) -> str:
        return self.gateway_settings.of(record).address

    def register(self, journal: Journal) -> None:
        # In the login page's own process, started apart, nothing in the record can switch off or change what guards it.
        guarding = None if self.apart else self
        ROUTES.add(guarding, Gateway(self.gateway_settings, PHONE_OWNER_ACTIONS if self.apart else frozenset()), key=EVERY_OTHER)
        CLOSED.add(guarding, NEVER_FROM_OUTSIDE)
        ORIGINS.add(guarding, self.origins)
        ANSWERS_AT.add(guarding, self.address)
        if self.apart:
            PHONE_GUARDS.add(None, phone_vault)
        KEEP_UP.add(self, always)
        STAYS_UP.add(self, always)
        LISTENS.add(self, listen)
        AT_ONCE.add(self, agents_at_once)
