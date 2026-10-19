from journal.features.sharing.tunnel import Tunnel
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.share_targets import ShareTargets
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.share import Share
from journal.repositories.shares import Shares


class SharesShaper(Shaper):
    """A link as the viewer lists it: its address, what it opens on the first line of its brief, and whether it is open, locked and until when."""

    type = "share"

    def __init__(self, shares: Shares, targets: ShareTargets, tunnel: Tunnel) -> None:
        self.shares, self.targets, self.tunnel = shares, targets, tunnel

    def rows(self) -> list[V3Row]:
        return [self.row(share) for share in self.shares.in_()]

    def row(self, share: Share) -> V3Row:
        target = self.targets.viewer_ref(share)
        return V3Row.of("share", share, title=f"Share of {target.replace(':', ' ')}", abstract=self.tunnel.link_of(share.token), brief=self.opened(target),
                        completed=seconds(share.stopped_at),
                        data={"target": target, "token": share.token, "expires": seconds(share.expires_at), "views": share.views, "approved": share.approved,
                              "password": "set" if share.password else "", "comments": share.comments, "agent_replies": True, "layout": {}, "once": False, "view": ""})

    def opened(self, target: str) -> str:
        """What the link opens, one line each; nothing once the row it opened is gone."""
        return "\n".join(self.targets.opens(target)) if target else ""
