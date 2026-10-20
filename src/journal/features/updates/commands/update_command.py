from argparse import Namespace

from journal.console.command import Command
from journal.features.updates.support.updating import Updating
from journal.support.where import Where


class UpdateCommand(Command):
    """journal update: the newest release of this major version installed as Install update does, the journal restarted on it."""

    noun = "update"
    default_verb = "now"

    def __init__(self, updating: Updating) -> None:
        self.updating = updating

    def arguments(self, verbs) -> None:
        self.verb(verbs, "now", "install the newest release of this major version and restart the journal on it")
        self.verb(verbs, "check", "say whether a newer release of this major version is out")

    def now(self, args: Namespace, where: Where) -> int:
        self.updating.read()
        newest = self.updating.newest().version
        self.updating.update_now(where.actor)
        print(f"updating from {self.updating.running().version} to {newest}: the journal restarts on {newest} once the install is done, within a few minutes")
        return 0

    def check(self, args: Namespace, where: Where) -> int:
        self.updating.read()
        print(self.updating.said())
        return 0
