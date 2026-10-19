from journal.features.updates.support.updating import Updating
from journal.http.support.request import Request
from journal.support.response import Response


class UpdateController:
    """What the viewer needs to offer the newer release: what is out and the version running, and the update itself."""

    def __init__(self, updating: Updating) -> None:
        self.updating = updating

    def index(self, request: Request) -> Response:
        return Response.json(self.updating.standing())

    def update(self, request: Request) -> Response:
        self.updating.update_now(request.actor)
        return Response.json(self.updating.standing(), 202)
