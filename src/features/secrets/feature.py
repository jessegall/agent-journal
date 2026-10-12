from controllers.base import SAVE_REWRITES
from declaring.registries import SECRET_CHECKS
from events.agents import ClockTicked
from events.answers import Allowed, Refused
from events.asking import ToolCallAsked
from events.secrets import PurgeDue
from expects import WHEN, Answered, Dispatches, File, Given, Wrote, answering, at
from framework.base import Feature
from framework.journal import Journal
from features.secrets.announcing import updated_added
from controllers.secrets.controller import Secrets
from features.secrets.details import SecretsDetails
from features.secrets.answering import NEVER_READ, RefuseSecretsFile
from features.secrets.handlers import PurgeDeletedSecrets
from features.secrets.leaks import LeakAlarm
from features.secrets.listeners import PURGE_EVERY, SpotThePurgeHour
from features.secrets.picking import refuse_secret_that_runs_commands

from controllers.secrets.values import secrets_folder
from resources.secrets import Secret

__all__ = ["Secrets"]


def asked(tool: str, input: str) -> ToolCallAsked:
    return ToolCallAsked(tool=tool, input=input, paths=() if tool == "Bash" else (input,), session="claude-1")


VALUES = answering({".journal/project-id": "pid", ".secrets/pid.env": 'API_KEY="abc"\n'})
KEY = [{"name": "key", "variable": "API_KEY"}]


def deleted(days: int) -> Secret:
    return Secret(n=1, title="GitHub", deleted=WHEN - days * 86400, data={"secret_fields": KEY})


class SecretsFeature(Feature):
    details = SecretsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ClockTicked, SpotThePurgeHour(), expects=[
            Given(ClockTicked(agent=1), clock=at(WHEN)) >> Dispatches(PurgeDue().once(f"purge|{int(WHEN // PURGE_EVERY)}")),
        ])
        journal.events.handle(PurgeDue, PurgeDeletedSecrets(), expects=[
            Given(PurgeDue(), rows=[deleted(31)], files=VALUES) >> Wrote(File(".secrets/pid.env", "The values of this project's secrets", mode="600")),
            Given(PurgeDue(), rows=[deleted(10)], files=VALUES) >> Wrote(File(".secrets/pid.env", 'API_KEY="abc"')),
        ])
        journal.agent.append_to_line("secret.updated", updated_added)
        journal.events.answer(ToolCallAsked, RefuseSecretsFile(), expects=[
            Given(asked("Bash", f"cat {secrets_folder()}/values")) >> Answered(Refused(NEVER_READ)),
            Given(asked("Bash", "cat ~/.config/agent-journal/secrets/values")) >> Answered(Refused(NEVER_READ)),
            Given(asked("Bash", "journal secret run github -- gh pr list")) >> Answered(Allowed()),
            Given(asked("Read", "README.md")) >> Answered(Allowed()),
            Given(asked("Read", ".secrets/../README.md")) >> Answered(Allowed()),
        ])
        SAVE_REWRITES.add(self, LeakAlarm())
        SECRET_CHECKS.add(self, refuse_secret_that_runs_commands)
