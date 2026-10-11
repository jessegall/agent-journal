from controllers.base import SAVE_REWRITES
from controllers.features import SECRET_CHECKS
from expects import Given, Kept, Refused
from features.base import Feature
from features.journal import Journal
from features.secrets.announcing import updated_added
from features.secrets.controller import Secrets
from features.secrets.details import SecretsDetails
from features.secrets.guard import RefuseSecretsFile
from features.secrets.handlers import PurgeDeletedSecrets
from features.secrets.leaks import LeakAlarm
from features.secrets.picking import refuse_secret_that_runs_commands

from features.secrets.values import secrets_folder
from providers.payload import BashCall, ReadCall

__all__ = ["Secrets"]

NEVER_READ = ("The secrets file is never read by an agent: use journal secret run <name> -- <command>, "
              "and ask the user for what is missing with journal secret request.")


def shell(command: str) -> BashCall:
    return BashCall.from_payload("Bash", {"command": command}, {})


class SecretsFeature(Feature):
    details = SecretsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PurgeDeletedSecrets())
        journal.agent.append_to_line("secret.updated", updated_added)
        journal.agent.interceptor(RefuseSecretsFile(), expects=[
            Given(shell(f"cat {secrets_folder()}/values")) >> Refused(NEVER_READ),
            Given(shell("cat ~/.config/agent-journal/secrets/values")) >> Refused(NEVER_READ),
            Given(ReadCall.from_payload("Read", {"file_path": f"{secrets_folder()}/values"}, {})) >> Refused(NEVER_READ),
            Given(shell("journal secret run github -- gh pr list")) >> Kept(),
            Given(ReadCall.from_payload("Read", {"file_path": "/etc/hosts"}, {})) >> Kept(),
        ])
        SAVE_REWRITES.add(self, LeakAlarm())
        SECRET_CHECKS.add(self, refuse_secret_that_runs_commands)
