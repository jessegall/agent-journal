from journal.http.request import Request
from journal.http.response import Response
from journal.http.viewer_seen import ViewerSeen


class ViewerController:
    """Whether a viewer tab is open on this journal."""

    def __init__(self, seen: ViewerSeen) -> None:
        self.seen = seen

    def show(self, request: Request) -> Response:
        return Response.json({"open": self.seen.open()})
