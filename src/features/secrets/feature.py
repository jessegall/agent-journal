from controllers.base import SAVE_REWRITES
from declaring.registries import SECRET_CHECKS
from events.agents import ClockTicked
from expects import WHEN, File, Given, Kept, Refused, Wrote, answering
from framework.base import Feature
from framework.journal import Journal
from features.secrets.announcing import updated_added
from controllers.secrets.controller import Secrets
from features.secrets.details import SecretsDetails
from features.secrets.guard import RefuseSecretsFile
from features.secrets.handlers import PurgeDeletedSecrets
from features.secrets.leaks import LeakAlarm
from features.secrets.picking import refuse_secret_that_runs_commands

from controllers.secrets.values import secrets_folder
from resources.secrets import Secret
from payload import BashCall, ReadCall
from resources.types import AgentRow

__all__ = ["Secrets"]

NEVER_READ = ("The secrets file is never read by an agent: use journal secret run <name> -- <command>, "
              "and ask the user for what is missing with journal secret request.")


def shell(command: str) -> BashCall:
    return BashCall.from_payload("Bash", {"command": command}, {})

VALUES = answering({".journal/project-id": "pid", ".secrets/pid.env": 'API_KEY="abc"\n'})
KEY = [{"name": "key", "variable": "API_KEY"}]


def deleted(days: int) -> Secret:
    return Secret(n=1, title="GitHub", deleted=WHEN - days * 86400, data={"secret_fields": KEY})


class SecretsFeature(Feature):
    details = SecretsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PurgeDeletedSecrets(), expects=[
            Given(ClockTicked(agent=1), rows=[deleted(31), AgentRow(n=1, title="claude-1")], files=VALUES) >> Wrote(File(".secrets/pid.env", "The values of this project's secrets")),
            Given(ClockTicked(agent=1), rows=[deleted(10), AgentRow(n=1, title="claude-1")], files=VALUES) >> Wrote(File(".secrets/pid.env", 'API_KEY="abc"')),
        ])
        journal.agent.append_to_line("secret.updated", updated_added)
        journal.agent.interceptor(RefuseSecretsFile(), expects=[
            Given(shell(f"cat {secrets_folder()}/values")) >> Refused(NEVER_READ),
            Given(shell("cat ~/.config/agent-journal/secrets/values")) >> Refused(NEVER_READ),
            Given(ReadCall.from_payload("Read", {"file_path": ".secrets/values"}, {})) >> Refused(NEVER_READ),
            Given(shell("journal secret run github -- gh pr list")) >> Kept(),
            Given(ReadCall.from_payload("Read", {"file_path": "README.md"}, {})) >> Kept(),
            Given(ReadCall.from_payload("Read", {"file_path": ".secrets/../README.md"}, {})) >> Kept(),
        ])
        SAVE_REWRITES.add(self, LeakAlarm())
        SECRET_CHECKS.add(self, refuse_secret_that_runs_commands)
