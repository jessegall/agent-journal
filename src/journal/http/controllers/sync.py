from journal.http.support.request import Request
from journal.support.response import Response
from journal.sync.sync_status import SyncStatus


class SyncController:
    """The status bar's line for a shared journal's sync with its team server, empty in a journal in no team."""

    def __init__(self, status: SyncStatus) -> None:
        self.status = status

    def show(self, request: Request) -> Response:
        return Response.json({"line": self.status.line()})
