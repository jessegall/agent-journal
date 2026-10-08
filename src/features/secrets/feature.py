from features.base import Feature
from features.journal import Journal
from features.secrets.controller import Secrets
from features.secrets.details import SecretsDetails
from features.secrets.handlers import PurgeDeletedSecrets

__all__ = ["Secrets"]


class SecretsFeature(Feature):
    details = SecretsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PurgeDeletedSecrets())
