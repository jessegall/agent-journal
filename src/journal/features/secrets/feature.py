from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.secrets.commands.secret_command import SecretCommand
from journal.features.secrets.listeners.keep_out_of_private import KeepOutOfPrivate
from journal.features.secrets.listeners.alarm_on_leak import AlarmOnLeak
from journal.features.secrets.listeners.ask_when_expired import AskWhenExpired
from journal.features.secrets.listeners.tell_allowed import TellAllowed
from journal.features.secrets.seeds.secret_files import SecretFiles


class Secrets(Feature):
    name = "secrets"
    title = "Secrets"
    help = "A key or a login the agent may use without seeing it: its values live in a file in your home folder, never in the journal, and you fill them in on the Secrets page."
    KEPT_OUT = Nudge(name, "kept_out", "the secrets and the MCP keys in the private folder are out of your reach", "a secret reaches a program through `journal secret run <n> -- <program>`; its value is never yours to read", repeat_after=0)
    ALLOWED = Nudge(name, "allowed", "the user let secret {{n}}, {{title}}, go to {{programs}}", "run it with `journal secret run {{n}} -- <program> ...`", repeat_after=0)
    nudges = (KEPT_OUT, ALLOWED)
    commands = (SecretCommand,)
    seeds = (SecretFiles,)
    listeners = (AlarmOnLeak, KeepOutOfPrivate, TellAllowed, AskWhenExpired)
