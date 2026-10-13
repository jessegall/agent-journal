import os
from pathlib import Path

from agents.terminal import AT_ONCE
from engine.stop import STAYS_UP
from framework.base import Feature
from features.hosted_journal.details import HostedJournalDetails
from features.hosted_journal.gateway import NEVER_FROM_OUTSIDE, PHONE_OWNER_ACTIONS, Gateway
from features.hosted_journal.people import people_of
from features.hosted_journal.phones import VaultGuard
from features.hosted_journal.standing import Standing
from features.hosted_journal.vault import Vault
from features.hosted_journal.watch import DiskWatch
from framework.journal import Journal
from framework.phone.desktop import CLOSED
from resources.phones import PHONE_GUARDS
from framework.phone.members import MEMBER_RIGHTS
from engine.address import ANSWERS_AT
from declaring.registries import SHARE_ORIGINS
from declaring.registries import EVERY_OTHER, SHARE_ROUTES, SHARE_TICKS
from declaring.registries import SHARE_KEEP_UP, SHARE_LISTENS
from controllers.sharing.services import Listen

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

    def register(self, journal: Journal) -> None:
        standing = Standing(os.environ.get(APART) == "1")
        # In the login page's own process, started apart, nothing in the record can switch off or change what guards it.
        guarding = None if standing.apart else self
        SHARE_ROUTES.add(guarding, Gateway(standing.settings, PHONE_OWNER_ACTIONS if standing.apart else {}), key=EVERY_OTHER)
        CLOSED.add(guarding, NEVER_FROM_OUTSIDE)
        SHARE_ORIGINS.add(guarding, standing.origins)
        ANSWERS_AT.add(guarding, standing.address)
        MEMBER_RIGHTS.add(guarding, people_of)
        if standing.apart:
            PHONE_GUARDS.add(None, phone_vault)
        SHARE_TICKS.add(guarding, DiskWatch())
        SHARE_KEEP_UP.add(self, always)
        STAYS_UP.add(self, always)
        SHARE_LISTENS.add(self, listen)
        AT_ONCE.add(self, agents_at_once)
