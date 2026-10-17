from journal.features.feature import Feature


class Secrets(Feature):
    name = "secrets"
    title = "Secrets"
    help = "A key or a login the agent may use without seeing it: its values live in a file in your home folder, never in the journal, and you fill them in on the Secrets page."
