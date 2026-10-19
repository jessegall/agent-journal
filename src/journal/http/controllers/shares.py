from journal.features.sharing.share_actions import ShareActions
from journal.features.sharing.share_targets import ShareTargets
from journal.features.sharing.tunnel import Tunnel
from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.share import Share
from journal.repositories.shares import Shares


class ShareController(Controller[Share]):
    """The links that let someone outside read one document, report or plan: each with its address and what it opens, and whether it asks for a password, never the password."""

    def __init__(self, shares: Shares, actions: ShareActions, targets: ShareTargets, tunnel: Tunnel) -> None:
        self.repository, self.actions, self.targets, self.tunnel = shares, actions, targets, tunnel

    def rows(self) -> list[Share]:
        return self.repository.in_()

    def is_open(self, row: Share) -> bool:
        return row.stopped_at is None

    def shown_page(self, rows: list[Share]) -> list[dict]:
        return [self.described(share) for share in rows]

    def described(self, share: Share) -> dict:
        target = self.targets.of(share)
        fields = {name: value for name, value in ModelFields.of(share).items() if name != "password"}
        return {**fields, "locked": bool(share.password), "link": self.tunnel.link_of(share.token), "target": str(target) if target else "",
                "opens": self.targets.opens(str(target)) if target else []}

    def store(self, request: Request) -> Response:
        body = request.body
        share = self.actions.create(str(body.get("target", "")), str(body.get("expires", "7d")), str(body.get("password", "")), bool(body.get("comments")), request.actor)
        return Response.json(self.shown(share), 201)

    def approve(self, request: Request) -> Response:
        return Response.json(self.shown(self.actions.approve(self.repository.find(request.number("id")), request.actor)))

    def stop(self, request: Request) -> Response:
        return Response.json(self.shown(self.actions.stop(self.repository.find(request.number("id")), request.actor)))

    def opens(self, request: Request) -> Response:
        """What a link to a row would open, before it is made."""
        return Response.json(self.targets.opens(request.query.get("target", "")))
