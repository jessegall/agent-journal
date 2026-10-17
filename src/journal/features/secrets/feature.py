from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.secrets.commands.secret_command import SecretCommand
from journal.features.secrets.listeners.keep_out_of_private import KeepOutOfPrivate
from journal.features.secrets.listeners.alarm_on_leak import AlarmOnLeak


class Secrets(Feature):
    name = "secrets"
    title = "Secrets"
    help = "A key or a login the agent may use without seeing it: its values live in a file in your home folder, never in the journal, and you fill them in on the Secrets page."
    KEPT_OUT = Nudge(name, "kept_out", "the secrets and the MCP keys in the private folder are out of your reach", "a secret reaches a program through `journal secret run <n> -- <program>`; its value is never yours to read", repeat_after=0)
    nudges = (KEPT_OUT,)
    commands = (SecretCommand,)
    listeners = (AlarmOnLeak, KeepOutOfPrivate)
