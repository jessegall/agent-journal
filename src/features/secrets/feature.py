from controllers.base import SAVE_REWRITES
from controllers.features import SECRET_CHECKS
from features.base import Feature
from features.journal import Journal
from features.secrets.controller import Secrets
from features.secrets.details import SecretsDetails
from features.secrets.guard import RefuseSecretsFile
from features.secrets.handlers import PurgeDeletedSecrets
from features.secrets.leaks import LeakAlarm
from features.secrets.picking import refuse_secret_that_runs_commands

__all__ = ["Secrets"]


class SecretsFeature(Feature):
    details = SecretsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PurgeDeletedSecrets())
        journal.agent.interceptor(RefuseSecretsFile())
        SAVE_REWRITES.add(self, LeakAlarm())
        SECRET_CHECKS.add(self, refuse_secret_that_runs_commands)
