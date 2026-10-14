from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments


class EntryController(Controller[Entry]):
    """The timeline, and what changed since an id, which is how the viewer stays live."""

    def __init__(self, entries: Entries, environments: Environments) -> None:
        self.repository, self.environments = entries, environments

    def since(self, request: Request) -> Response:
        environment = self.environment_id(request)
        after = int(request.query.get("since", 0))
        return Response.json({"entries": self.repository.since(environment, after), "latest": self.repository.last_id(environment)})
