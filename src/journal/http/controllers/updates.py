from dataclasses import asdict

from journal.features.updates.support.updating import Updating
from journal.features.updates.support.changelog import Changelog
from journal.http.support.request import Request
from journal.support.response import Response


class UpdateController:
    """What the viewer needs to offer the newer release: what is out and the version running, and the update itself."""

    def __init__(self, updating: Updating, changelog: Changelog) -> None:
        self.updating, self.changelog = updating, changelog

    def index(self, request: Request) -> Response:
        page = self.changelog.page(0)
        return Response.json({**asdict(self.updating.readings()), "changelog": page.text, "shown": page.shown, "more": page.more})

    def fresh(self, request: Request) -> Response:
        self.updating.read()
        return self.index(request)

    def changes(self, request: Request) -> Response:
        page = self.changelog.page(int(request.queried("skip")))
        return Response.json({"changelog": page.text, "shown": page.shown, "more": page.more})

    def update(self, request: Request) -> Response:
        self.updating.update_now(request.actor)
        return Response.json(self.updating.readings(), 202)
