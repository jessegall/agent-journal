import re
import uuid
from datetime import datetime, timedelta, timezone

from journal.features.sharing.share_password import SharePassword
from journal.features.sharing.tunnel import Tunnel
from journal.http.v3.action_body import ActionBody
from journal.http.v3.share_targets import ShareTargets
from journal.http.v3.v3_row import viewer_ref
from journal.models.actor import Actor
from journal.models.actor_kind import ActorKind
from journal.models.author import Author
from journal.models.message import Message
from journal.models.ref import Ref
from journal.models.share import Share
from journal.refused import Refused
from journal.repositories.messages import Messages
from journal.repositories.shares import Shares

SPANS = {"h": timedelta(hours=1), "d": timedelta(days=1)}
NEVER = ("", "0", "never")


class ShareActions:
    """What the viewer and the share command do to a link: make one for a document, report or plan, open one that waits, and stop one. The tunnel runs while a link is open."""

    def __init__(self, shares: Shares, targets: ShareTargets, tunnel: Tunnel, messages: Messages) -> None:
        self.shares, self.targets, self.tunnel, self.messages = shares, targets, tunnel, messages

    def create(self, body: ActionBody, by: Actor) -> Share:
        """A link the user made opens at once; one the agent made waits for the user's Accept on the card it puts in the chat."""
        target = self.targets.named(body.title)
        share = self.shares.save(Share(token=str(uuid.uuid4()), expires_at=self.until(body.expires), approved=by.kind == ActorKind.USER,
                                       password=SharePassword.hashed(body.password) if body.password else "", comments=body.comments), by)
        self.targets.link(share, target, by)
        if share.approved:
            self.tunnel.start()
        else:
            self.ask(share, target, by)
        return share

    def ask(self, share: Share, target: Ref, by: Actor) -> None:
        """The card that asks the user to open a link the agent made: what it opens, and Accept or Deny."""
        named = viewer_ref(target)
        opens = "\n".join(f"- {line}" for line in self.targets.opens(named))
        comments = "\n\nVisitors can leave comments, which come to the chat." if share.comments else ""
        text = f"The agent wants to share {named.replace(':', ' ')}\n\nNothing opens until you accept it. Whoever has the link will be able to view:\n{opens}{comments}\n\n{self.tunnel.link_of(share.token)}"
        buttons = [{"label": "Accept", "type": "share", "n": share.id, "action": "approve"}, {"label": "Deny", "type": "share", "n": share.id, "action": "stop"}]
        self.messages.save(Message(author=Author.AGENT, text=text, data={"buttons": buttons}), by)

    def approve(self, n: int, body: ActionBody, by: Actor) -> Share:
        share = self.shares.save(self.shares.find(n).opened(), by)
        self.tunnel.start()
        return share

    def stop(self, n: int, body: ActionBody, by: Actor) -> Share:
        share = self.shares.save(self.shares.find(n).stopped(datetime.now(timezone.utc)), by)
        self.tunnel.settle()
        return share

    def read(self, n: int, body: ActionBody, by: Actor) -> Share:
        return self.shares.find(n)

    @staticmethod
    def until(expires: str) -> datetime | None:
        """When a link given as 12h, 7d or never ends."""
        given = expires.strip().lower()
        if given in NEVER:
            return None
        if not re.fullmatch(r"\d+[hd]", given):
            raise Refused("expires is a number of hours or days, like 12h or 7d, or never")
        return datetime.now(timezone.utc) + int(given[:-1]) * SPANS[given[-1]]
