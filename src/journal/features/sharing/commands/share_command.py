from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.sharing.support.tunnel import Tunnel
from journal.features.sharing.share_actions import ShareActions
from journal.features.sharing.share_targets import ShareTargets
from journal.models.share import Share
from journal.repositories.shares import Shares


class ShareCommand(Command):
    noun = "share"

    def __init__(self, actions: ShareActions, targets: ShareTargets, shares: Shares, tunnel: Tunnel) -> None:
        self.actions, self.targets, self.shares, self.tunnel = actions, targets, shares, tunnel

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "make a link that opens one document, report or plan, read-only, and nothing else; the agent's waits for the user's Accept in the chat, so share only when the user asks")
        create.add_argument("ref", help="what it opens, as docs:12, reports:4 or plans:2")
        create.add_argument("--expires", default="7d", help="when it ends: 12h, 7d or never")
        create.add_argument("--password", default="", help="a password visitors must give")
        create.add_argument("--comments", action="store_true", help="let visitors comment under a name of their own; their comments come to the chat")
        self.verb(verbs, "opens", "what a link to the row would open, before you make it").add_argument("ref")
        self.verb(verbs, "stop", "end a link at once").add_argument("n", type=int)
        self.verb(verbs, "list", "every link here")

    def create(self, args: Namespace, caller: Caller) -> int:
        share = self.actions.create(args.ref, args.expires, args.password, args.comments, caller.actor)
        waits = "open" if share.approved else "waiting for the user's Accept in the chat"
        print(f"share {share.id}: {self.tunnel.link_of(share.token)}, {waits}")
        return 0

    def opens(self, args: Namespace, caller: Caller) -> int:
        print("\n".join(self.targets.opens(args.ref)))
        return 0

    def stop(self, args: Namespace, caller: Caller) -> int:
        share = self.actions.stop(self.shares.find(args.n), caller.actor)
        print(f"share {share.id} stopped")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for share in self.shares.in_():
            print(f"{share.id:>4}  {self.targets.of(share) or 'gone'}  {self.data(share)}  {self.tunnel.link_of(share.token)}")
        return 0

    @staticmethod
    def data(share: Share) -> str:
        if not share.is_live(datetime.now(timezone.utc)):
            return "ended"
        return "open" if share.approved else "waiting for the user's Accept"
