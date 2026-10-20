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
        follow = self.verb(verbs, "follow", "follow a branch: install its newest commit instead of the releases")
        follow.add_argument("branch", help="the branch's name")
        self.verb(verbs, "unfollow", "follow the releases of this major version again")

    def now(self, args: Namespace, where: Where) -> int:
        self.updating.read()
        target = self.updating.target()
        self.updating.update_now(where.actor)
        print(f"updating from {self.updating.label()} to {target.label}: the journal restarts on it once the install is done, within a few minutes")
        return 0

    def follow(self, args: Namespace, where: Where) -> int:
        self.updating.follow(args.branch, where.actor)
        self.updating.read()
        print(f"following the branch {args.branch}: {self.updating.said()}")
        return 0

    def unfollow(self, args: Namespace, where: Where) -> int:
        self.updating.follow("", where.actor)
        print("following the releases again")
        return 0

    def check(self, args: Namespace, where: Where) -> int:
        self.updating.read()
        print(self.updating.said())
        return 0
