import re
import uuid
from datetime import datetime, timedelta, timezone

from journal.features.sharing.support.share_password import SharePassword
from journal.features.sharing.share_targets import ShareTargets
from journal.features.sharing.support.tunnel import Tunnel
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.support.ref import Ref
from journal.models.share import Share
from journal.support.rejection import Rejection
from journal.repositories.messages import Messages
from journal.repositories.shares import Shares

SPANS = {"h": timedelta(hours=1), "d": timedelta(days=1)}
DISABLED_VALUES = ("", "0", "never")


class ShareActions:
    """What the viewer and the share command do to a link: make one for a document, report or plan, open one that waits, and stop one. The tunnel runs while a link is open."""

    def __init__(self, shares: Shares, targets: ShareTargets, tunnel: Tunnel, messages: Messages) -> None:
        self.shares, self.targets, self.tunnel, self.messages = shares, targets, tunnel, messages

    def create(self, named: str, expires: str, password: str, comments: bool, actor: Actor) -> Share:
        target = self.targets.lookup(named)
        share = self.shares.save(Share(token=str(uuid.uuid4()), expires_at=self.until(expires), approved=actor.is_user(),
                                       password=SharePassword.hashed(password) if password else "", comments=comments), actor)
        self.targets.link(share, target, actor)
        if share.approved:
            self.tunnel.start()
        else:
            self.ask(share, target, actor)
        return share

    def ask(self, share: Share, target: Ref, actor: Actor) -> None:
        opens = "\n".join(f"- {line}" for line in self.targets.opens(str(target)))
        comments = "\n\nVisitors can leave comments, which come to the chat." if share.comments else ""
        text = f"The agent wants to share {target}\n\nNothing opens until you accept it. Whoever has the link will be able to view:\n{opens}{comments}\n\n{self.tunnel.share_link(share.token)}"
        buttons = [{"label": "Accept", "path": f"/shares/{share.id}/approve"}, {"label": "Deny", "path": f"/shares/{share.id}/stop"}]
        self.messages.save(Message(author=Author.AGENT, text=text, data={"buttons": buttons}), actor)

    def approve(self, share: Share, actor: Actor) -> Share:
        opened = self.shares.save(share.opened(), actor)
        self.tunnel.start()
        return opened

    def stop(self, share: Share, actor: Actor) -> Share:
        stopped = self.shares.save(share.stopped(datetime.now(timezone.utc)), actor)
        self.tunnel.settle()
        return stopped

    @staticmethod
    def until(expires: str) -> datetime | None:
        given = expires.strip().lower()
        if given in DISABLED_VALUES:
            return None
        if not re.fullmatch(r"\d+[hd]", given):
            raise Rejection("expires is a number of hours or days, like 12h or 7d, or never")
        return datetime.now(timezone.utc) + int(given[:-1]) * SPANS[given[-1]]
