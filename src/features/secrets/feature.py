from controllers.base import SAVE_REWRITES
from features.base import Feature
from features.journal import Journal
from features.secrets.controller import Secrets
from features.secrets.details import SecretsDetails
from features.secrets.guard import RefuseSecretsFile
from features.secrets.handlers import PurgeDeletedSecrets
from features.secrets.leaks import LeakAlarm

__all__ = ["Secrets"]


class SecretsFeature(Feature):
    details = SecretsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PurgeDeletedSecrets())
        journal.agent.interceptor(RefuseSecretsFile())
        SAVE_REWRITES.add(self, LeakAlarm())
