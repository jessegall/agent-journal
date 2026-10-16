from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.entry import Entry
from journal.repositories.entries import Entries


class EntryController(Controller[Entry]):
    """The timeline, and what changed since an id, which is how the viewer stays live."""

    def __init__(self, entries: Entries) -> None:
        self.repository = entries

    def since(self, request: Request) -> Response:
        after = int(request.query.get("since", 0))
        return Response.json({"entries": self.repository.since(after), "latest": self.repository.last_id()})
