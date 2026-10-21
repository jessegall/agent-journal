from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.support.viewer_presence import ViewerPresence


class ViewerController:
    """Whether a viewer tab is open on this journal."""

    def __init__(self, viewed: ViewerPresence) -> None:
        self.seen = viewed

    def show(self, request: Request) -> Response:
        return Response.json({"open": self.seen.open()})
