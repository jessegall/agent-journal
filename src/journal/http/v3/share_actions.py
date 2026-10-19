import re
import uuid
from datetime import datetime, timedelta, timezone

from journal.features.sharing.share_password import SharePassword
from journal.features.sharing.tunnel import Tunnel
from journal.http.v3.action_body import ActionBody
from journal.http.v3.share_targets import ShareTargets
from journal.models.actor import Actor
from journal.models.share import Share
from journal.refused import Refused
from journal.repositories.shares import Shares

SPANS = {"h": timedelta(hours=1), "d": timedelta(days=1)}
NEVER = ("", "0", "never")


class ShareActions:
    """What the viewer does to a link: make one for a document, report or plan, open one that waits, and stop one. The tunnel runs while a link is open."""

    def __init__(self, shares: Shares, targets: ShareTargets, tunnel: Tunnel) -> None:
        self.shares, self.targets, self.tunnel = shares, targets, tunnel

    def create(self, body: ActionBody, by: Actor) -> Share:
        """A link the user made in the viewer, open at once."""
        target = self.targets.named(body.title)
        share = self.shares.save(Share(token=str(uuid.uuid4()), expires_at=self.until(body.expires), approved=True,
                                       password=SharePassword.hashed(body.password) if body.password else "", comments=body.comments), by)
        self.targets.link(share, target, by)
        self.tunnel.start()
        return share

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
