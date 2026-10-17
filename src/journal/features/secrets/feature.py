from journal.features.feature import Feature
from journal.features.secrets.listeners.alarm_on_leak import AlarmOnLeak


class Secrets(Feature):
    name = "secrets"
    title = "Secrets"
    help = "A key or a login the agent may use without seeing it: its values live in a file in your home folder, never in the journal, and you fill them in on the Secrets page."
    listeners = (AlarmOnLeak,)
