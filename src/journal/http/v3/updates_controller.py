from journal.features.updates.updating import Updating
from journal.http.request import Request
from journal.http.response import Response
from journal.version import VERSION


class UpdatesController:
    """What the viewer needs to offer the newer release: what is out, the update itself, and the version now running, which the page waits on to reload."""

    def __init__(self, updating: Updating) -> None:
        self.updating = updating

    def releases(self, request: Request) -> Response:
        return Response.json(self.updating.standing())

    def update(self, request: Request) -> Response:
        self.updating.update_now(request.actor)
        return Response.json(self.updating.standing(), 202)

    def changelog(self, request: Request) -> Response:
        return Response.json({"version": VERSION})
