from argparse import Namespace

from journal.console.command import Command
from journal.features.updates.support.updater import Updater
from journal.repositories.release_messages import ReleaseMessages
from journal.support.caller import Caller


class UpdateCommand(Command):
    """journal update: the newest release of this major version installed as Install update does, the journal restarted on it."""

    noun = "update"
    default_verb = "apply"

    def __init__(self, updating: Updater, messages: ReleaseMessages) -> None:
        self.updating, self.release_messages = updating, messages

    def arguments(self, verbs) -> None:
        self.verb(verbs, "apply", "install the newest release of this major version and restart the journal on it")
        self.verb(verbs, "check", "say whether a newer release of this major version is out")
        follow = self.verb(verbs, "follow", "follow a branch: install its newest commit instead of the releases")
        follow.add_argument("branch", help="the branch's name")
        self.verb(verbs, "unfollow", "follow the releases of this major version again")
        self.verb(verbs, "messages", "the unread messages the releases since the last update carry for the agent; reading them marks them read for the whole project")

    def apply(self, args: Namespace, caller: Caller) -> int:
        self.updating.read()
        target = self.updating.target()
        self.updating.update_immediately(caller.actor)
        print(f"updating from {self.updating.label()} to {target.label}: the journal restarts on it once the install is done, within a few minutes")
        return 0

    def messages(self, args: Namespace, caller: Caller) -> int:
        unread = self.release_messages.unread()
        if not unread:
            print("no release message is unread")
            return 0
        for message in unread:
            print(f"{message.version}: {message.text}")
            self.release_messages.save(message.opened(), caller.actor)
        return 0

    def follow(self, args: Namespace, caller: Caller) -> int:
        self.updating.follow(args.branch, caller.actor)
        self.updating.read()
        print(f"following the branch {args.branch}: {self.updating.line()}")
        return 0

    def unfollow(self, args: Namespace, caller: Caller) -> int:
        self.updating.follow("", caller.actor)
        print("following the releases again")
        return 0

    def check(self, args: Namespace, caller: Caller) -> int:
        self.updating.read()
        print(self.updating.line())
        return 0
